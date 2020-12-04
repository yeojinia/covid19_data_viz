import React from 'react';


class SelectOption extends React.Component {

    render(){
        return(
            <form>
                <b>Axis Ordering &nbsp;&nbsp;</b>
                <select value ={this.props.usState} >
                    <option value ="default">default order</option>
                    <option value ="max_corr">maximum correlation</option>
                </select>
            </form>
        )
    }
}
export default SelectOption;