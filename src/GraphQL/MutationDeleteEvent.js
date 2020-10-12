import gql from "graphql-tag";

export default gql(`
mutation($phone: String!) {
  delete(phone: $phone) {
    device
    phone
  }
}`);
