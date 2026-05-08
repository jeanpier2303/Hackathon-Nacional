import requests


BASE_URL = (
    "https://www.datos.gov.co/resource/jbjy-vk9h.json"
)


def get_contracts(
    page: int = 1,
    limit: int = 10
):

    offset = (
        page - 1
    ) * limit

    response = requests.get(
        BASE_URL,
        params={
            "$limit": limit,
            "$offset": offset
        }
    )

    response.raise_for_status()

    data = response.json()

    return {

        "data": data,

        "pagination": {

            "page": page,

            "limit": limit,

            "total": len(data),

            "totalPages": 1
        }
    }