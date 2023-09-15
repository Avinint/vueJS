import {request} from "@api/api";

interface RequestBody {
    [index: number]: never
    [index: string]: any
}

export const upload = async (url: string, body: FormData|RequestBody) => {
    if (!(body instanceof FormData)) {
        body = toFormData(body)
    }

    return await request(url, body, 'post')
}

const toFormData = (body: RequestBody): FormData => {

    const formData = new FormData()
    for (const prop in body) {
        formData.append(prop, body[prop])
    }

    return formData;
}