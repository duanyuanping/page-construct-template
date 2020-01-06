import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './main.less';
import {
    throttle,
    updateState,
} from './util';

import Index from './src/demo.js';

class WrapperIndex extends Component {

    constructor(props) {
        super(props);

        const observer = new MutationObserver(throttle(function () {
            console.log('dom updated');
            updateState && updateState();
        }, 0, 500));
        const article = document.body;

        const options = {
            'childList': true,
            'attributes': true,
            'subtree': true
        };

        observer.observe(article, options);
    }

    componentDidMount() {
        updateState && updateState();
    }

    componentDidUpdate() {
        updateState && updateState();
    }

    render() {
        return (
            <div>
                <Index />
            </div>
        );
    }
}

function renderPage() {
    const container = document.getElementById('root');
    ReactDOM.render(<WrapperIndex />, container, () => {
        console.log('render demo success');
    });
}

renderPage();
