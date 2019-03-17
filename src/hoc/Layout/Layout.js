import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


class Layout extends Component {

    state = {
        showSideDrawer:true
    }

    sideDrawerClosedHandler = () =>{
        this.setState({showSideDrawer:false});
    }

    render () {
        return (
            <Auxiliary> 
            <Toolbar/>
            <SideDrawer 
            open={this.state.showSideDrawer}
            closed={this.sideDrawerClosedHandler}/>
            <main className={classes.Content}>
                {this.props.children}
            </main>
        </Auxiliary>
        )
    }
} 
export default Layout;