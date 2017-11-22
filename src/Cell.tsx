import * as React from 'react';

import * as gameoflife from './game-of-life';

import './Cell.css';

type CellProps = gameoflife.Cell & {
    onClick(): void
};

class Cell extends React.Component<CellProps> {
    constructor(props: CellProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.props.onClick();
    }

    render() {
        const{
            status,
        } = this.props;

        let className = 'cell';
        if  ( status === gameoflife.CellStatus.ALIVE ) {
            className = 'cell--alive';
        } else {
            className = 'cell--dead';
        }

        return (
            <button
                className={className}
                onClick={this.onClick}
            />
        );
    }
}

export default Cell;