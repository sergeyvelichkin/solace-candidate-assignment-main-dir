import { Advocate } from "@/db/schema";

export type GetAdvocatesResponse = {
    data: Advocate[]
    total: number
}

export type { Advocate }