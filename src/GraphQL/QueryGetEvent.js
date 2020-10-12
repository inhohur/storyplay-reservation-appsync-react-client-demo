import gql from "graphql-tag";

export default gql(`
query($phone: String!) {
  getEvent(phone: $phone) {
    phone
    device
  }
}`);
