import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import QueryGetEvent from "../GraphQL/QueryGetEvent";

class ViewEvent extends Component {

    render() {
        const { event, loading } = this.props;

        return (
            <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
                <Link to="/" className="ui button">Back to events</Link>
                <div className="ui items">
                    <div className="item">
                        {event && <div className="content">
                            <div className="header">{event.phone}</div>
                            <div className="description">{event.device}</div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

}

const ViewEventWithData = graphql(
    QueryGetEvent,
    {
        options: ({ match: { params: { id } } }) => ({
            variables: { id },
            fetchPolicy: 'cache-and-network',
        }),
        props: ({ data: { getEvent: event, loading} }) => ({
            event,
            loading,
        }),
    },
)(ViewEvent);

export default ViewEventWithData;