import React, { Component} from 'react'
import axios from 'axios'

class Fib extends Component {
    state = {
        seenIndex: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchValues()
        this.fetchIndex()
    }
}
