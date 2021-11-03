const fetchData = async () => {
    try {
        const client = contentful.createClient({
            space: 'k85fc407hkln',
            accessToken: 'wpulMc5wNgFwz0k_YRlUqXUzCHyLLZIqWm-5qWX9TUM'
        });
        const response = await client.getEntries({
            content_type: 'musicPlayer'
        });
        const playlist = response.items.map(item => {
            const {title, artist, image: {fields: {file: {url: imageUrl}}}, audio: {fields: {file: {url: audioUrl}}}} = item.fields;
            return {title, artist, imageUrl, audioUrl};
        });
        return playlist;    
    } catch (error) {
        console.log(error);
    }
};

export default fetchData;