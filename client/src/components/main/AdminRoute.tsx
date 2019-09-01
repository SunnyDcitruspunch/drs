import React, { Component } from 'react'
import { observer } from 'mobx-react'
import AdminTabs from './AdminTabs'
import GeneralTabs from './GeneralTabs'

interface IProps {
    admin: boolean
}

const AdminRoute = (
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