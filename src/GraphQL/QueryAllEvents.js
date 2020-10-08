import gql from "graphql-tag";

export default gql(`
query {
  all(limit: 1000) {
    items {
      device
      phone
    }
  }
}`);
