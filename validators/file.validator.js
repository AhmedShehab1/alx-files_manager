const { ObjectId } = require('mongodb');

export const validateFileUpload = async (req, res, next) => {
    try {
        const {
          name, type, parentId = 0, isPublic = false, data,
        } = req.body;

        if (!name) return res.status(400).json({ error: 'Missing name' });


        const allowedTypes = ['folder', 'file', 'image'];

        if (!type || !allowedTypes.includes(type)) return res.status(400).json({ error: 'Missing type' });

        if ((type !== 'folder') && !data) return res.status(400).json({ error: 'Missing data' });

        if (parentId) {

            if (!ObjectId.isValid(parentId)) return res.status(400).json({ error: 'Invalid parentId' });

            const parent = await dbClient.getDocument('files', { _id: new ObjectId(parentId) });
            req.body.parent = parent;

            if (!parent) return res.status(400).json({ error: 'Parent not found' });
            if (parent.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
        }

        req.body.parentId = parentId;
        req.body.isPublic = isPublic;

        next();
    } catch (error) {
        console.error('File upload validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
