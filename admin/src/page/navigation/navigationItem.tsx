import { Box, Button, IconButton } from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { NavigationTreeItem, NavigationTreeItemType } from "../../api/page/navigation";
interface Props {
    data: NavigationTreeItem,
    handleEdit: (data: NavigationTreeItem) => void
    handleDelete: (id: number, type: NavigationTreeItemType) => void
    handleSelect: (type: NavigationTreeItemType, dataRef: NavigationTreeItem) => void
}
export const NavigationItem = (props: Props) => {
    const { data, handleDelete, handleEdit, handleSelect } = props
    const { type } = data
    return <div style={{ position: "relative" }}>
        <IconButton onClick={() => handleDelete(data.id, data.type)} aria-label="delete" size="small" sx={{ position: "absolute", right: 20 }}>
            <DeleteForeverOutlinedIcon fontSize="inherit" />
        </IconButton>
        <IconButton onClick={() => handleEdit(data)} aria-label="edit" size="small" sx={{ position: "absolute", right: 40 }}>
            <EditOutlinedIcon fontSize="inherit" />
        </IconButton>
        <Button onClick={() => handleSelect(type, data)}>
            {data.name}
        </Button>
    </div>
}