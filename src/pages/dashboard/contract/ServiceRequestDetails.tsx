import { useParams } from "react-router-dom"

export default  function ServiceRequestDetails() {
     const { id } = useParams<{ id: string }>()
    return (
        <div>ServiceRequestDetails</div>
    )   


}