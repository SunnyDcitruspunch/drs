import React, { Component } from 'react'
// import { Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
// import { IUserStore, IAuthStore } from '../../stores';
import AdminTabs from './AdminTabs'
import GeneralTabs from './GeneralTabs'

interface IProps {
    admin: boolean
}

const AdminRoute = inject("UserStore", "AuthStore")(
    observer(
        class AdminRoute extends Component<IProps, {}> {

            render(){
                const { admin } = this.props
                if (admin) {
                    return <AdminTabs />
                } else {
                    return <GeneralTabs />
                }               
            }
        }
    )
)

export default AdminRoute