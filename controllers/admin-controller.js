import bcrypt from 'bcrypt';
import Admin from '../models/adminSchema.js';
import Class from '../models/classSchema.js';
import Student from '../models/studentSchema.js';
import Teacher from '../models/teacherSchema.js';
import Subject from '../models/subjectSchema.js';
import Notice from '../models/noticeSchema.js';
import Complain from '../models/complainSchema.js';

export const adminRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const admin = new Admin({
            ...req.body,
            password: hashedPass
        });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const adminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).send({ message: "User not found" });
        }

        const validated = await bcrypt.compare(password, admin.password);

        if (!validated) {
            return res.status(401).send({ message: "Invalid password" });
        }

        admin.password = undefined;
        res.status(200).send(admin);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const result = await Admin.findByIdAndDelete(req.params.id)

        await Class.deleteMany({ school: req.params.id });
        await Student.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Notice.deleteMany({ school: req.params.id });
        await Complain.deleteMany({ school: req.params.id });

        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

export const updateAdmin = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            //res.body.password = await bcrypt.hash(res.body.password, salt);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        let result = await Admin.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}
