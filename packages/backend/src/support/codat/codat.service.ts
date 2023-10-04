import { Injectable, Scope } from "@nestjs/common"
import axios, { AxiosInstance } from "axios"

@Injectable({ scope: Scope.DEFAULT })
export class CodatService {
  private httpClient: AxiosInstance
  constructor() {
    const basicAuthHeader = process.env.CODAT_AUTH_HEADER
    if (!basicAuthHeader) {
      throw new Error("Missing auth header for codat service")
    }

    const baseUrl = "https://api.codat.io"
    const authHeaderValue = basicAuthHeader

    this.httpClient = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: authHeaderValue,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
  }

  async createCompany(
    companyName: string,
    description?: string
  ): Promise<CodatCreateCompanyResponse> {
    const response = await this.httpClient.post<CodatCreateCompanyResponse>(
      "/companies",
      {
        name: companyName,
        description,
      }
    )
    return response.data
  }

  async getCompany(companyId: string): Promise<CodatCompanyResponse> {
    const response = await this.httpClient.get<CodatCompanyResponse>(
      `/companies/${companyId}`
    )
    return response.data
  }

  async listAccounts(companyId: string): Promise<ListAccountsResponse> {
    const response = await this.httpClient.get<ListAccountsResponse>(
      `/companies/${companyId}/data/accounts`
    )
    return response.data
  }

  async getAccount(
    companyId: string,
    accountId: string
  ): Promise<CodatGetAccountResponse> {
    const response = await this.httpClient.get<CodatGetAccountResponse>(
      `/companies/${companyId}/data/accounts/${accountId}`
    )
    return response.data
  }

  // unsure if we need to create an account or if one is created when going though the link flow

  async listConnections(companyId: string): Promise<CodatListConnections> {
    const response = await this.httpClient.get<CodatListConnections>(
      `/companies/${companyId}/connections/`
    )
    return response.data
  }

  async getConnection(
    companyId: string,
    connectionId: string
  ): Promise<CodatDataConnection> {
    const response = await this.httpClient.get<CodatDataConnection>(
      `/companies/${companyId}/connections/${connectionId}`
    )
    return response.data
  }

  async deleteConnection(
    companyId: string,
    connectionId: string
  ): Promise<void> {
    await this.httpClient.delete(
      `/companies/${companyId}/connections/${connectionId}`
    )
    return
  }
}

// Types

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

export interface CodatCompanyResponse {
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

export interface CodatDataConnection {
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
  connectionInfo: {
    additionalProp1: string // these seem weird to add but the docs have them here so wanted to include it
    additionalProp2: string
    additionalProp3: string
  }
}

export interface CodatListConnections {
  results: CodatDataConnection[]
  _links: CodatLinks
  pageNumber: number
  pageSize: number
  totalResults: number
}

export interface CodatGetAccountResponse {
  id: string
  nominalCode: string
  name: string
  description: string
  fullyQualifiedCategory: string
  fullyQualifiedName: string
  currency: string
  currentBalance: number
  type: string
  status: string
  isBankAccount: boolean
  validDataTypeLinks: ValidDataTypeLinks[]
  metadata: {
    isDeleted: boolean
  }
  modifiedDate: string
  sourceModifiedDate: string
}

export interface ListAccountsResponse {
  results: CodatGetAccountResponse[]
  _links: CodatLinks
  pageNumber: number // int
  pageSize: number // int
  totalResults: number //int
}

interface ValidDataTypeLinks {
  property: string
  links: string[]
}

interface CodatLinks {
  self: {
    href: string
  }
  current: {
    href: string
  }
  next: {
    href: string
  }
  previous: {
    href: string
  }
}
