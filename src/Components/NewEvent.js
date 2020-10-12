import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql } from "react-apollo";
import QueryAllEvents from "../GraphQL/QueryAllEvents";
import QueryGetEvent from "../GraphQL/QueryGetEvent";
import MutationCreateEvent from "../GraphQL/MutationCreateEvent";

class NewEvent extends Component {

    static defaultProps = {
        createEvent: () => null,
    }

    state = {
        event: {
            phone: '',
            device: '',
        }
    };

    handleChange(field, { target: { value } }) {
        const { event } = this.state;

        event[field] = value;

        this.setState({ event });
    }

    handleDateChange(field, value) {
        this.handleChange(field, { target: { value: value.format() } });
    }

    handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { createEvent, history } = this.props;
        const { event } = this.state;

        console.log('handleSave : ' + JSON.stringify(event));
        await createEvent({ ...event });

        history.push('/');
    }

    render() {
        const { event } = this.state;

        return (
            <div className="ui container raised very padded segment">
                <h1 className="ui header">Create an event</h1>
                <div className="ui form">
                    <div className="field required eight wide">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" id="phone" value={event.phone} onChange={this.handleChange.bind(this, 'phone')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="device">Device</label>
                        <input type="text" id="device" value={event.device} onChange={this.handleChange.bind(this, 'device')} />
                    </div>
                    <div className="ui buttons">
                        <Link to="/" className="ui button">Cancel</Link>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default graphql(
    MutationCreateEvent,
    {
        props: (props) => ({
            createEvent: (event) => {
                console.log('save event : ' + JSON.stringify(event))
                return props.mutate({
                    update: (proxy, { data: { createEvent } }) => {
                        // Update QueryAllEvents
                        const query = QueryAllEvents;
                        const data = proxy.readQuery({ query });

                        console.log('save event 2 : ' + JSON.stringify(createEvent));
                        data.all.items = [...data.all.items.filter(e => e.phone !== createEvent.phone), createEvent];

                        proxy.writeQuery({ query, data });

                        // Create cache entry for QueryGetEvent
                        const query2 = QueryGetEvent;
                        const variables = { phone: createEvent.phone };
                        const data2 = { getEvent: { ...createEvent } };

                        proxy.writeQuery({ query: query2, variables, data: data2 });
                    },
                    variables: event,
                    optimisticResponse: () => ({
                        createEvent: {
                            ...event, phone: event.phone, device: event.device
                        }
                    }),
                })
            }
        })
    }
)(NewEvent);
