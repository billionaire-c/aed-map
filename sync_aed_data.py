"""국립중앙의료원 AED 정보 조회 서비스에서 화성시 AED 데이터를 받아와
Supabase의 aed_devices 테이블에 upsert 한다 (external_id 기준 중복 갱신).

실행: python sync_aed_data.py
"""

import os
import sys
import xml.etree.ElementTree as ET

import requests
from dotenv import load_dotenv

load_dotenv()

AED_API_URL = "http://apis.data.go.kr/B552657/AEDInfoInqireService/getEgytAedManageInfoInqire"
DATA_GO_KR_SERVICE_KEY = os.environ["DATA_GO_KR_SERVICE_KEY"]

SUPABASE_URL = os.environ["VITE_SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

SIDO = "경기도"
SIGUNGU = "화성시"
PAGE_SIZE = 500


def format_hours(item: dict) -> str:
    def hm(t):
        return f"{t[:2]}:{t[2:]}" if t else "?"

    mon = (item.get("monSttTme"), item.get("monEndTme"))
    sat = (item.get("satSttTme"), item.get("satEndTme"))
    sun = (item.get("sunSttTme"), item.get("sunEndTme"))

    if mon == ("0000", "2400") and sat == ("0000", "2400") and sun == ("0000", "2400"):
        return "24시간 운영"
    return f"평일 {hm(mon[0])}-{hm(mon[1])} · 주말 {hm(sat[0])}-{hm(sat[1])}"


def fetch_all_items() -> list:
    items = []
    page = 1
    while True:
        resp = requests.get(
            AED_API_URL,
            params={
                "serviceKey": DATA_GO_KR_SERVICE_KEY,
                "pageNo": page,
                "numOfRows": PAGE_SIZE,
                "Q0": SIDO,
                "Q1": SIGUNGU,
            },
            timeout=15,
        )
        resp.raise_for_status()
        root = ET.fromstring(resp.content)

        result_code = root.findtext("./header/resultCode")
        if result_code != "00":
            raise RuntimeError(f"API 오류: {root.findtext('./header/resultMsg')}")

        page_items = root.findall("./body/items/item")
        if not page_items:
            break

        for el in page_items:
            items.append({child.tag: child.text for child in el})

        total_count = int(root.findtext("./body/totalCount") or 0)
        if len(items) >= total_count:
            break
        page += 1

    return items


def to_device_row(item: dict) -> dict:
    address = item.get("buildAddress", "")
    place = item.get("buildPlace")
    return {
        "external_id": item.get("serialSeq"),
        "name": item.get("org") or address,
        "address": f"{address} ({place})" if place else address,
        "lat": float(item["wgs84Lat"]) if item.get("wgs84Lat") else None,
        "lng": float(item["wgs84Lon"]) if item.get("wgs84Lon") else None,
        "install_agency": item.get("org"),
        "operating_hours": format_hours(item),
    }


def upsert_devices(rows: list):
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/aed_devices",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
        params={"on_conflict": "external_id"},
        json=rows,
        timeout=30,
    )
    resp.raise_for_status()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print(f"{SIDO} {SIGUNGU} AED 데이터 수집 중...")
    items = fetch_all_items()
    print(f"{len(items)}건 수집 완료. Supabase에 저장 중...")

    rows = [to_device_row(item) for item in items if item.get("wgs84Lat") and item.get("wgs84Lon")]

    batch_size = 200
    for i in range(0, len(rows), batch_size):
        upsert_devices(rows[i : i + batch_size])
        print(f"  {min(i + batch_size, len(rows))}/{len(rows)}건 저장됨")

    print(f"완료: {len(rows)}건 동기화 (좌표 없는 {len(items) - len(rows)}건은 제외)")


if __name__ == "__main__":
    main()
