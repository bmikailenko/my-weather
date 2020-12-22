/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getZipcode = /* GraphQL */ `
  query GetZipcode($id: ID!) {
    getZipcode(id: $id) {
      id
      zipcode
      createdAt
      updatedAt
    }
  }
`;
export const listZipcodes = /* GraphQL */ `
  query ListZipcodes(
    $filter: ModelZipcodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZipcodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        zipcode
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
