const { User } = require('../models');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { nome, email } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        const user = await User.create({ nome, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser && existingUser.id !== parseInt(id)) {
            return res.status(409).json({ error: 'Email já cadastrado para outro usuário.' });
        }
        await user.update({ nome, email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generatePdfReport = async (req, res) => {
    try {
        const users = await User.findAll();

        const doc = new PDFDocument({ margin: 50 });
        let filename = 'relatorio_usuarios.pdf';
        filename = encodeURIComponent(filename);
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Relatório de Usuários', { align: 'center' });
        doc.moveDown(1.5);

        const startX = doc.page.margins.left;
        const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        const columnWidths = [
            usableWidth * 0.10,
            usableWidth * 0.40,
            usableWidth * 0.50
        ];
        const rowHeight = 35;

        let currentX = startX;
        const headerY = doc.y;

        doc.rect(startX, headerY, usableWidth, rowHeight)
           .fill('#007bff');

        doc.fillColor('white')
           .fontSize(12)
           .font('Helvetica-Bold');

        doc.text('ID', currentX, headerY + (rowHeight / 2) - 6, { width: columnWidths[0], align: 'center' });
        currentX += columnWidths[0];
        doc.text('Nome', currentX, headerY + (rowHeight / 2) - 6, { width: columnWidths[1], align: 'left' });
        currentX += columnWidths[1];
        doc.text('Email', currentX, headerY + (rowHeight / 2) - 6, { width: columnWidths[2], align: 'left' });

        doc.font('Helvetica');
        let currentY = headerY + rowHeight;

        users.forEach((user, index) => {
            if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                currentY = doc.page.margins.top;

                currentX = startX;
                doc.rect(startX, currentY, usableWidth, rowHeight).fill('#007bff');
                doc.fillColor('white').fontSize(12).font('Helvetica-Bold');
                doc.text('ID', currentX, currentY + (rowHeight / 2) - 6, { width: columnWidths[0], align: 'center' });
                currentX += columnWidths[0];
                doc.text('Nome', currentX, currentY + (rowHeight / 2) - 6, { width: columnWidths[1], align: 'left' });
                currentX += columnWidths[1];
                doc.text('Email', currentX, currentY + (rowHeight / 2) - 6, { width: columnWidths[2], align: 'left' });
                doc.font('Helvetica');
                currentY += rowHeight;
            }

            const rowBackgroundColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
            doc.rect(startX, currentY, usableWidth, rowHeight)
               .fill(rowBackgroundColor)
               .stroke('#e0e0e0');

            doc.fillColor('black')
               .fontSize(10);

            currentX = startX;
            doc.text(user.id.toString(), currentX, currentY + (rowHeight / 2) - 5, { width: columnWidths[0], align: 'center' });
            currentX += columnWidths[0];
            doc.text(user.nome, currentX + 5, currentY + (rowHeight / 2) - 5, { width: columnWidths[1] - 10, align: 'left' });
            currentX += columnWidths[1];
            doc.text(user.email, currentX + 5, currentY + (rowHeight / 2) - 5, { width: columnWidths[2] - 10, align: 'left' });

            currentY += rowHeight;
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateExcelReport = async (req, res) => {
    try {
        const users = await User.findAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Usuários');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nome', key: 'nome', width: 30 },
            { header: 'Email', key: 'email', width: 40 }
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '007BFF' }
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.autoFilter = 'A1:C1';

        users.forEach(user => {
            worksheet.addRow(user);
        });

        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            if (rowNumber > 1 && rowNumber % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F8F9FA' }
                };
            }
        });

        worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'relatorio_usuarios.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
