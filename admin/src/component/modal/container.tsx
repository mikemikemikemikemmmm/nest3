import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { MODAL_MOUNT_DOM_ID, ZIndex } from "../../const"

export const ModalContainer = () => {
    const isShowModal = useSelector((state: RootState) => state.appSlice.isShowModal)
    const handleCloseModal = ()=>{
        
    }
    return (
        <div style={{
            display: isShowModal ? "flex" : "none",
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: ZIndex.Modal,
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <section
                style={{ maxWidth: "80%", maxHeight: "80%" }}
                id={MODAL_MOUNT_DOM_ID}
            />
        </div>)
}