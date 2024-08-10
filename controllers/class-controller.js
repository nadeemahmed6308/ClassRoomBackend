
import Class from '../models/classSchema.js';
import Student from '../models/studentSchema.js';
import Subject from '../models/subjectSchema.js';
import Teacher from '../models/teacherSchema.js';

export const classCreate = async (req, res) => {
    try {
        const { className, adminID } = req.body;

        // Check if class already exists
        const existingClassByName = await Class.findOne({ className, school: adminID });
        if (existingClassByName) {
            return res.status(400).json({ message: 'Sorry, this class name already exists' });
        }

        // Create new class
        const sclass = new Class({
            className,
            school: adminID
        });

        const result = await sclass.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

export const classList = async (req, res) => {
    try {
        const classes = await Class.find({ school: req.params.id });
        if (classes.length > 0) {
            res.status(200).json(classes);
        } else {
            res.status(404).json({ message: "No classes found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
   
export const getClassDetail = async (req, res) => {
    try {
        const sclass = await Class.findById(req.params.id).populate("school", "schoolName").execPopulate();
        if (sclass) {
            res.status(200).json(sclass);
        } else {
            res.status(404).json({ message: "No class found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

export const getClassStudents = async (req, res) => {
    try {
        const students = await Student.find({ className: req.params.id });
        if (students.length > 0) {
            const modifiedStudents = students.map((student) => ({
                ...student._doc,
                password: undefined
            }));
            res.status(200).json(modifiedStudents);
        } else {
            res.status(404).json({ message: "No students found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        await Student.deleteMany({ className: req.params.id });
        await Subject.deleteMany({ className: req.params.id });
        await Teacher.deleteMany({ teachClass: req.params.id });

        res.status(200).json(deletedClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const deleteClasses = async (req, res) => {
    try {
        const deletedClasses = await Class.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).json({ message: "No classes found to delete" });
        }

        await Student.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });

        res.status(200).json(deletedClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
