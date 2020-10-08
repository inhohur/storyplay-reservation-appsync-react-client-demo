import gql from "graphql-tag";

export default gql(`
mutation($phone: String! $device: String!) {
  save(
    phone: $phone
    device: $device
  ) {
    phone
    device
  }
}`);
