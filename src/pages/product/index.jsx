import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Product/ViewDetail";
import { callFetchBookById } from "../../services/api";

const ProductPage = () => {
    const [dataBook, setDataBook] = useState()
    const url = window.location.href; 
    const id = url.split('id=')[1]; 
        

    useEffect(() => {
        fetchBook(id);
    }, [id]);

    const fetchBook = async (id) => {
        const res = await callFetchBookById(id);    
        if (res && res.data) {
            let raw = res.data;
            //process data
            raw.items = getImages(raw);
            setDataBook(raw);
        }
    }

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                },
            )
        }
        if (raw.slider) {
            // console.log(raw.slider);
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            })
        }
        
        return images;
    }
    return (
        <>
            <ViewDetail dataBook={dataBook} />
        </>
    )
}

export default ProductPage;