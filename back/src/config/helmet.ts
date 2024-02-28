import { HelmetOptions } from "helmet"

export const helmetConfig: Readonly<HelmetOptions> = {
    crossOriginResourcePolicy: { policy: "same-site" }
}