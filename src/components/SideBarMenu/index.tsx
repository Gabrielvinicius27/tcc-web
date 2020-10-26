import React, { useState } from 'react';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import "./styles.css"
import { useHistory } from 'react-router-dom';

interface itemProps{
    data: Array<itemType>;
}
interface itemType{    
    name:string;
    label:string;
    items?:Array<subItemType>
}
interface subItemType{
    name:string;
    label:string;
    path:string;
    fatherIndex?:number;
}

const SideBarMenu: React.FC<itemProps> = ({data,...rest}) => {
    
    let list = [{ishidden:true}];
    if(data.length>0){
        for(let i = 1; i<data.length; i++){
            list = [...list,{ishidden:true}]
        }
    }

    const [hidden, setHidden] = useState(list);
    const [show, setShow] = useState(false);
    const history = useHistory();

    const toggleFunction = (position:number) => {
        const newArray = hidden.map((item,index)=>{
            if(index===(position)){
                return{...item,["ishidden"]:!hidden[index].ishidden};
            }
            return item; 
        })
        setHidden(newArray)  
    }

    const toggleSideBar = () => {
        setShow(!show);
    }

    const routeTo = (path:string) => {
        history.push(path);
        window.location.reload();
    }

    
    return (
        <main className="mainSideBarMenu">
            {show?(<div className="sidebar">
                <List disablePadding dense>
                    {data.map((item, index)=>{
                        return(
                            <React.Fragment key={item.name}>
                            <div className="item">
                                <ListItem key={item.name} button onClick = {(e) => toggleFunction(index)}>
                                        <ListItemText><span className="item-text">{item.label}</span></ListItemText>
                                </ListItem>
                            </div>
                                {Array.isArray(item.items)?
                                (
                                    !hidden[index].ishidden && <List disablePadding>
                                        {item.items.map((subItem)=>{
                                            return(
                                                <div className="sub-item">
                                                    <ListItem key={subItem.name} button onClick = {(e) => routeTo(subItem.path)}>
                                                        <ListItemText><span className="sub-item-text">{subItem.label}</span></ListItemText>
                                                    </ListItem>
                                                </div>
                                                )
                                            }
                                        )}
                                    </List>
                                ):null
                                }
                            </React.Fragment>
                            )
                        }
                    )}
                </List>
            </div>):(
                <div className = "hidded-side-bar"></div>
            )}
            <div>
                <button className="button" type="button" onClick={toggleSideBar}>
                    {!show?(<div className="show"></div>):(<div className="hide"></div>)}
                </button>
            </div>
        </main>
    )
}
export default SideBarMenu;