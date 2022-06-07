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
        result.pages = Math.ceil(pageCount / limit)
        result.offset = 2; 
        result.currentPage = {
            page,
            limit,
            sort: res.locals._sort,
            startOffset: page - result.offset >= 1 ? page -result.offset : 1,
            endOffset: page + result.offset <= result.pages ? page + result.offset : result.pages
        }
        

        if (endIndex < pageCount) {
            result.next = {
                page: page + 1,
                limit,
                sort: res.locals._sort,
                
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit,
                sort: res.locals._sort,
                
            }
        }

        try {
            if (req.query.hasOwnProperty('_sort'))
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