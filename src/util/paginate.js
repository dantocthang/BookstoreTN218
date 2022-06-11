function paginate(model, perPage = 12) {
    return async (req, res, next) => {
        // Sort
        res.locals._sort = {
            enable: false,
            type: 'default',
        }

        // Paginate
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        if (req.query.hasOwnProperty('_sort')) {
            Object.assign(res.locals._sort, {
                enable: true,
                type: req.query.type,
                column: req.query.column
            })
        }




        if (isNaN(page)) page = 1;
        if (isNaN(limit)) limit = perPage;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit

        const result = {}
        const pageCount = await model.countDocuments()
        result.pages = Math.ceil(pageCount / limit) // Tổng số trang sau khi phân trang
        result.offset = 2; // Số trang hiển thị trước và sau trang hiện tại
        result.currentPage = {
            page,
            limit,
            sort: res.locals._sort, // Lưu biến sort gồm các cài đặt sắp xếp: tăng dần, giảm dần, trường cần sắp xếp, ...
            startOffset: page - result.offset >= 1 ? page - result.offset : 1,
            endOffset: page + result.offset <= result.pages ? page + result.offset : result.pages
        }


        // Lưu trữ thông tin cho trang tiếp theo
        if (endIndex < pageCount) {
            result.next = {
                page: page + 1,
                limit,
                sort: res.locals._sort,

            }
        }


        // Lưu trữ thông tin cho trang trước đó
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit,
                sort: res.locals._sort,

            }
        }

        try {
            //Search
            if (req.query.hasOwnProperty('_search')) {
                result.data = await model.find({name: { $regex: new RegExp(req.query.v, 'i') }}).limit(limit).skip(startIndex)
                result.v=req.query.v
            }
            else if (req.query.hasOwnProperty('_sort'))
                result.data = await model.find().sort({
                    [req.query.column]: req.query.type
                }).limit(limit).skip(startIndex)
            else
                result.data = await model.find().limit(limit).skip(startIndex)
            res.paginatedResult = result
            next()
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
}

export default paginate