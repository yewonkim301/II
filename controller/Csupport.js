const {
    Support
} = require("../models/Index");
const jwt = require("jsonwebtoken");

// GET /supportMain 고객센터 페이지 로드
exports.getSupport = async (req, res) => {
    try{
        let link = "/home"
        let title = "고객센터"
        const getSupport = await Support.findAll();
        res.render("/support/supportMain", getSupport, title, link);
    }
    catch (err) {
        console.error(err);
        res.send("Internal Server Error!");
    }
}

// GET /supportNewPost 고객 문의 등록 페이지 로드
exports.getNewSupport = async (req, res) => {
    try{
        res.render("/support/supportNewPost");
    }
    catch (err) {
        console.error(err);
        res.send("Internal Server Error!");
    }
}

// POST /supportNewPost 고객 문의 등록
exports.postSupport = async (req, res) => {
    try {
        link = "/supportMain" // 고객센터 메인페이지로 이동
        title = "문의글 등록"
        const { userid, userid_num } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const { content, secret } = req.body
        const newSupport = await Support.create({
            userid_num: userid_num,
            content: content,
            secret: secret
        })
        res.send(newSupport,{isSuccess: true}, link, title);
    }
    catch (err) {
        console.error(err);
        res.send("Internal Server Error!");
    }
}

// PATCH /support 고객 문의 답글
exports.postSupportComment = async (req,res) => {
    try{
        const {comment} = req.body;
        const postSupportComment = await Support.update({
            comment: comment
        })
        res.send(postSupportComment, {isSuccess:true});
    }
    catch (err) {
        console.error(err);
        res.send("Internal Server Error!");
    }
}

// DELETE /supportMain 문의글 삭제
exports.deleteSupport = async (req,res) => {
    try{
        const { userid, userid_num } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const destroySupport = await Support.destroy({
            where:
            {
                userid_num: userid_num
            }
        })
        if (destroySupport) {
            res.send({ isDeleted: true });
        } else {
            res.send({ isDeleted: false });
        }
    }
    catch (err) {
        console.error(err);
        res.send("Internal Server Error!");
    }
}