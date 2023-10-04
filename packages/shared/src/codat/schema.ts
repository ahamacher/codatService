// Keeping this as a partial type of CodatCompanyResponse to consolidate where the fields are defined since the only difference is "lastSync"
export type CodatCreateCompanyResponse = Pick<
  CodatCompanyResponse,
  | "id"
  | "name"
  | "description"
  | "platform"
  | "redirect"
  | "dataConnections"
  | "created"
  | "createdByUserName"
>

export type CodatCompanyResponse = {
  id: string
  name: string // name used in our system to identify the company, this does not need to be unique
  description: string // description of the company, can be an empty string
  platform: string
  redirect: string // the redirect link url enabling the customer to start their auth flow journey for the company
  lastSync: string
  dataConnections: CodatDataConnection[] | []
  created: string
  createdByUserName: string
}

export type CodatDataConnection = {
  id: string // Unique identifier for a company's data connection.
  integrationId: string // A Codat ID representing the integration.
  integrationKey: string //A unique four-character ID that identifies the platform of the company's data connection. This ensures continuity if the platform changes its name in the future.
  sourceId: string // A source-specific ID used to distinguish between different sources originating from the same data connection. In general, a data connection is a single data source. However, for TrueLayer, sourceId is associated with a specific bank and has a many-to-one relationship with the integrationId.
  sourceType: "Accounting" | "Banking" | "Commerce" | "Other" | "Unknown" //The type of platform of the connection.
  platformName: string
  linkUrl: string
  status: "PendingAuth" | "Linked" | "Unlinked" | "Deauthorized" // The current authorization status of the data connection.
  lastSync: string
  created: string
  dataConnectionErrors?: {
    statusCode: string
    statusText: string
    errorMessage: string
    erroredOnUtc: string
  }[]
}
