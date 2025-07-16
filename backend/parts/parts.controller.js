import Parts from "./parts.model.js";

export const createPart = async (req, res) => {
    try {
        const {
            type,
            barcode,
            serialNumber,
            brand,
            model,
            specs,
            status,
            unusableReason
        } = req.body;

        const errors = {};

        if (!type) errors.type = "Part type is required";
        if (!barcode) errors.barcode = "Barcode is required";
        if (!serialNumber) errors.serialNumber = "Serial number is required";
        if (!brand) errors.brand = "Brand is required";
        if (!model) errors.model = "Model is required";

        const validTypes = ['CPU', 'Monitor', 'Mouse'];
        const validStatuses = ['active', 'unusable'];

        if (type && !validTypes.includes(type)) {
            errors.type = `Type must be one of: ${validTypes.join(', ')}`;
        }

        if (status && !validStatuses.includes(status)) {
            errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
        }

        if (unusableReason && status !== 'unusable') {
            errors.unusableReason = "Unusable reason can only be set if status is 'unusable'";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const part = await Parts.create({
            type,
            barcode,
            serialNumber,
            brand,
            model,
            specs,
            status,
            unusableReason
        });

        return res.status(201).json({
            message: "Part added successfully",
            part
        });

    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                errors: {
                    [duplicateField]: `${duplicateField} must be unique. This value already exists.`
                }
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const updatePart = async (req, res) => {
    try {
        const partId = req.params.id;
        const updateData = req.body;

        const updatedPart = await Parts.findByIdAndUpdate(
            partId,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updatedPart) {
            return res.status(404).json({ error: 'Part not found' });
        }

        res.status(200).json({ message: "Updated successfully", updatedPart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getAllParts = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};

        if (status) query.status = status;
        if (type) query.type = type;

        const parts = await Parts.find(query);

        if (parts.length == 0) return res.status(200).json({ success: true, message: "No Parts Found" });

        res.status(200).json({ success: true, message: "Parts fetched successfully", parts })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const markPartUnusable = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const part = await Parts.findByIdAndUpdate(
            id,
            {
                status: "unusable", unusableReason: reason
            },
            { new: true }
        );

        if (!part) return res.status(404).json({ message: "Part not found" });

        return res.status(200).json({ message: "Part marked as unusable", part });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update part", error: err });
    }
}

export const getUnusableParts = async (req, res) => {
    try {
        const parts = await Parts.find({status: "unusable"});
        if(!parts) return res.status(404).json({message: "No unusable Parts found"});

        return res.status(200).json({message: "Unusable Parts fetched success", parts});
    } catch (error) {
        return res.status(500).json({message: "Failed to unusable fetch parts", error: err});
    }
}

export const restorePart = async (req, res) => {
    try {
        const {id} = req.params;

        const part = await Parts.findByIdAndUpdate(
            id,
            {
                status: "active", unusableReason: null
            },
            {new : true}
        )

        if(!part) return res.status(404).json({message: "Part not found"});

        return res.status(200).json({message: "Part restored to active", part});
    } catch (error) {
        return res.status(500).json({message: "Failed to restore part", error: err});
    }
}
