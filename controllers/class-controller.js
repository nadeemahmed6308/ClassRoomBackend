import Class from '../models/classSchema.js';
import Student from '../models/studentSchema.js';
import Subject from '../models/subjectSchema.js';
import Teacher from '../models/teacherSchema.js';

export const classCreate = async (req, res) => {
    try {
        const sclass = new Class({
            className: req.body.className,
            school: req.body.adminID
        });

        const existingClassByName = await Class.findOne({
            className: req.body.className,
            school: req.body.adminID
        });

        if (existingClassByName) {
            res.send({ message: 'Sorry this class name already exists' });
        } else {
            const result = await sclass.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const classList = async (req, res) => {
    try {
        let classes = await Class.find({ school: req.params.id });
        if (classes.length > 0) {
            res.send(classes);
        } else {
            res.send({ message: "No classes found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getClassDetail = async (req, res) => {
    try {
        let sclass = await Class.findById(req.params.id);
        if (sclass) {
            sclass = await sclass.populate("school", "schoolName").execPopulate();
            res.send(sclass);
        } else {
            res.send({ message: "No class found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getClassStudents = async (req, res) => {
    try {
        let students = await Student.find({ className: req.params.id });
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.send({ message: "Class not found" });
        }

        await Student.deleteMany({ className: req.params.id });
        await Subject.deleteMany({ className: req.params.id });
        await Teacher.deleteMany({ teachClass: req.params.id });
        res.send(deletedClass);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteClasses = async (req, res) => {
    try {
        const deletedClasses = await Class.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.send({ message: "No classes found to delete" });
        }

        await Student.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });

        res.send(deletedClasses);
    } catch (error) {
        res.status(500).json(error);
    }
};
