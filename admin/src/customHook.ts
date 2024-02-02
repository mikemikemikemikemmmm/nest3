import { useState } from "react"

export const useModal = <ModalData>(emptyData: ModalData) => {
    const [modalDataProp, setModalDataProp] = useState<ModalData>(() => emptyData)
    const [isModalShow, setIsModalShow] = useState(false)
    const closeModal = () => {
        setModalDataProp(() => emptyData)
        setIsModalShow(false)
    }
    const handleCreate = () => {
        setModalDataProp(() => emptyData)
        setIsModalShow(true)
    }
    const handleEdit = (modalData: ModalData) => {
        setModalDataProp(modalData)
        setIsModalShow(true)
    }

}