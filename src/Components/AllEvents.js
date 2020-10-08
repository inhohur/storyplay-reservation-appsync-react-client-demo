import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import QueryAllEvents from "../GraphQL/QueryAllEvents";
import MutationDeleteEvent from "../GraphQL/MutationDeleteEvent";

class AllEvents extends Component {

    state = {
        busy: false,
    }

    static defaultProps = {
        events: [],
        deleteEvent: () => null,
    }

    async handleDeleteClick(event, e) {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete event ${event.phone}`)) {
            const { deleteEvent } = this.props;

            await deleteEvent(event);
        }
    }

    handleSync = async () => {
        const { client } = this.props;
        const query = QueryAllEvents;

        this.setState({ busy: true });

        console.log('----- handlesync');
        await client.query({
            query,
            fetchPolicy: 'network-only',
        });

        this.setState({ busy: false });
    }

    renderEvent = (event) => (
        <Link to={`/event/${event.phone}`} className="card" key={event.phone}>
            <div className="content">
                <div className="header">{event.phone}</div>
            </div>
            <div className="content">
                <div className="description"><i className="icon info circle"></i>{event.device}</div>
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, event)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    );

    render() {
        console.log('----- render');

        const { busy } = this.state;
        const { events } = this.props;


        console.log(JSON.stringify(events));
        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">All Events</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/newEvent" className="new-event content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new event</p>
                        </Link>
                    </div>
                    {[].concat(events).map(this.renderEvent)}
                </div>
            </div>
        );
    }

}

export default withApollo(compose(
    graphql(
        QueryAllEvents,
        {
            options: {
                fetchPolicy: 'network-only',
            },
            props: ({ data: { all = { items: [] } } }) => ({
                events: all.items
            })
        }
    ),
    graphql(
        MutationDeleteEvent,
        {
            options: {
                update: (proxy, { data: { deleteEvent } }) => {
                    const query = QueryAllEvents;
                    const data = proxy.readQuery({ query });

                    data.all.items = data.all.items.filter(event => event.phone !== deleteEvent.phone);

                    proxy.writeQuery({ query, data });
                }
            },
            props: (props) => ({
                deleteEvent: (event) => {
                    return props.mutate({
                        variables: { phone: event.phone },
                        optimisticResponse: () => ({
                            deleteEvent: {
                                ...event, __typename: 'Event', comments: { __typename: 'CommentConnection', items: [] }
                            }
                        }),
                    });
                }
            })
        }
    )
)(AllEvents));
