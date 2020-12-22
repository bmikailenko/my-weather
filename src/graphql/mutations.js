/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createZipcode = /* GraphQL */ `
  mutation CreateZipcode(
    $input: CreateZipcodeInput!
    $condition: ModelZipcodeConditionInput
  ) {
    createZipcode(input: $input, condition: $condition) {
      id
      zipcode
      createdAt
      updatedAt
    }
  }
`;
export const updateZipcode = /* GraphQL */ `
  mutation UpdateZipcode(
    $input: UpdateZipcodeInput!
    $condition: ModelZipcodeConditionInput
  ) {
    updateZipcode(input: $input, condition: $condition) {
      id
      zipcode
      createdAt
      updatedAt
    }
  }
`;
export const deleteZipcode = /* GraphQL */ `
  mutation DeleteZipcode(
    $input: DeleteZipcodeInput!
    $condition: ModelZipcodeConditionInput
  ) {
    deleteZipcode(input: $input, condition: $condition) {
      id
      zipcode
      createdAt
      updatedAt
    }
  }
`;
