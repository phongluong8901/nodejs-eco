import icons from "./icons"


const {AiOutlineStar, AiFillStar} = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const formartMoney = number => Number(number.toFixed(1)).toLocaleString()

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return
        const stars = []
    for (let i=0;i<+number;i++) stars.push(<AiFillStar color='orange' size={size || 16}/>)
    for (let i=5;i>+number;i--) stars.push(<AiOutlineStar color='orange' size={size || 16}/>)

    return stars
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);

    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++;
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Require this field.' }]);
        }
    }

    // Bạn có thể thêm validate email/password ở đây nếu muốn
    return invalids;
};

export const fortmatPrice = number => Math.round(number /1000) * 1000

export const generaterange = (start, end) => {
    const length = end + 1 - start
    return Array.from({length}, (_, index) => start + index)
}

export const getBase64 = (file) => {
    if (!file) return ''
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const formatMoney = number => {
    if (!Number(number)) return 0
    return Number(number.toFixed(1)).toLocaleString()
}