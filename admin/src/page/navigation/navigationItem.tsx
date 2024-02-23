import { Box, Button, Card, IconButton } from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { NavigationTreeItem } from "../../api/page/navigation";
import { NavigationTreeItemType } from "../../api/entityType";
// import { ShowText } from "../../component/showText";
interface Props {
    data: NavigationTreeItem,
    handleEdit: (data: NavigationTreeItem) => void
    handleDelete: (id: number, type: NavigationTreeItemType) => void
    handleSelect: (type: NavigationTreeItemType, dataRef: NavigationTreeItem) => void
}
export const NavigationItem = (props: Props) => {
    const { data, handleDelete, handleEdit, handleSelect } = props
    const { type } = data
    return (
        <Card variant="outlined">
            {
                data.type === "category" ?
                    data.name
                    :
                    <Button size="small"
                        onClick={() => handleSelect(type, data)}>
                        {data.name}
                    </Button>
            }
            <IconButton
                onClick={() => handleEdit(data)} aria-label="edit" size="small">
                <EditOutlinedIcon fontSize="inherit" />
            </IconButton>
            <IconButton
                onClick={() => handleDelete(data.id, data.type)}
                aria-label="delete" size="small" >
                <DeleteForeverOutlinedIcon fontSize="inherit" />
            </IconButton>
        </Card>
    )
}