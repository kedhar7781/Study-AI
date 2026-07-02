import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.units import inch

def generate_summary_pdf(summary_data, filepath):
    """
    Creates a styled PDF of the study material summary.
    """
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles matching our color palette (#6C63FF primary)
    primary_color = colors.HexColor('#6C63FF')
    secondary_color = colors.HexColor('#00C2FF')
    dark_text_color = colors.HexColor('#1E293B')
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=15
    )
    
    section_style = ParagraphStyle(
        'DocSection',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=secondary_color,
        spaceBefore=15,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_text_color,
        spaceAfter=8
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Bullet'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_text_color,
        leftIndent=15,
        spaceAfter=5
    )
    
    def_term_style = ParagraphStyle(
        'DocDefTerm',
        parent=styles['BodyText'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=primary_color
    )
    
    story = []
    
    # Title
    story.append(Paragraph("StudyAI – Interactive Summary", title_style))
    story.append(Spacer(1, 15))
    
    # Overview Summary
    story.append(Paragraph("Summary Overview", section_style))
    # Remove markdown symbols from summary string if any
    raw_summary = summary_data.get('summary', '')
    clean_summary = raw_summary.replace('#', '').replace('**', '')
    for paragraph_text in clean_summary.split('\n\n'):
        if paragraph_text.strip():
            story.append(Paragraph(paragraph_text.strip(), body_style))
            
    # Key Points
    key_points = summary_data.get('key_points', [])
    if key_points:
        story.append(Spacer(1, 10))
        story.append(Paragraph("Key Takeaways", section_style))
        for pt in key_points:
            story.append(Paragraph(f"• {pt}", bullet_style))
            
    # Definitions
    definitions = summary_data.get('definitions', [])
    if definitions:
        story.append(Spacer(1, 10))
        story.append(Paragraph("Important Definitions", section_style))
        def_data = []
        for d in definitions:
            term = d.get('term', '')
            definition = d.get('definition', '')
            def_data.append([
                Paragraph(term, def_term_style),
                Paragraph(definition, body_style)
            ])
            
        t = Table(def_data, colWidths=[1.5*inch, 5.0*inch])
        t.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ]))
        story.append(t)
        
    # Examples
    examples = summary_data.get('examples', [])
    if examples:
        story.append(Spacer(1, 10))
        story.append(Paragraph("Practical Examples", section_style))
        for ex in examples:
            story.append(Paragraph(f"• {ex}", bullet_style))
            
    # Memory Tricks
    memory_tricks = summary_data.get('memory_tricks', [])
    if memory_tricks:
        story.append(Spacer(1, 10))
        story.append(Paragraph("Memory Mnemonics & Tricks", section_style))
        for trick in memory_tricks:
            story.append(Paragraph(f"• {trick}", bullet_style))
            
    doc.build(story)


def generate_quiz_pdf(quiz_data, filepath):
    """
    Creates a styled PDF of the quiz worksheet, with an answer key at the end.
    """
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor('#6C63FF')
    secondary_color = colors.HexColor('#00C2FF')
    dark_text_color = colors.HexColor('#1E293B')
    
    title_style = ParagraphStyle(
        'QuizTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=15
    )
    
    meta_style = ParagraphStyle(
        'QuizMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.gray,
        spaceAfter=15
    )
    
    q_num_style = ParagraphStyle(
        'QNum',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=secondary_color
    )
    
    q_text_style = ParagraphStyle(
        'QText',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=dark_text_color
    )
    
    option_style = ParagraphStyle(
        'QOption',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_text_color,
        leftIndent=20
    )
    
    answer_key_title_style = ParagraphStyle(
        'KeyTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=20,
        spaceAfter=10
    )
    
    story = []
    
    # Title
    story.append(Paragraph(f"Quiz: {quiz_data.get('title', 'Study Evaluation')}", title_style))
    story.append(Paragraph(f"Difficulty: {quiz_data.get('difficulty', 'Medium').capitalize()}   |   Total Questions: {quiz_data.get('total_questions', 0)}", meta_style))
    story.append(Spacer(1, 15))
    
    questions = quiz_data.get('questions', [])
    answer_key = []
    
    for idx, q in enumerate(questions):
        q_num = idx + 1
        q_text = q.get('question', '')
        options = q.get('options', [])
        correct = q.get('correct_answer', '')
        explanation = q.get('explanation', '')
        
        # Add question
        q_p = Paragraph(f"<b>Q{q_num}.</b> {q_text}", q_text_style)
        story.append(q_p)
        story.append(Spacer(1, 8))
        
        # Add options or answer spaces
        if options:
            for opt in options:
                story.append(Paragraph(f"[  ]  {opt}", option_style))
                story.append(Spacer(1, 4))
        else:
            # Short answer space
            story.append(Spacer(1, 10))
            story.append(Table([[""]], colWidths=[6.5*inch], rowHeights=[0.8*inch], style=TableStyle([
                ('BOX', (0,0), (-1,-1), 1, colors.lightgrey),
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC'))
            ])))
            
        story.append(Spacer(1, 15))
        
        # Save to answer key
        answer_key.append({
            'num': q_num,
            'correct': correct,
            'explanation': explanation
        })
        
    # Append Answer Key on a separate page
    story.append(PageBreak())
    story.append(Paragraph("Answer Key & Explanations", answer_key_title_style))
    story.append(Spacer(1, 10))
    
    for ak in answer_key:
        key_text = f"<b>Q{ak['num']}. Correct Answer:</b> {ak['correct']}"
        story.append(Paragraph(key_text, q_text_style))
        story.append(Spacer(1, 4))
        exp_text = f"<i>Explanation:</i> {ak['explanation']}"
        story.append(Paragraph(exp_text, option_style))
        story.append(Spacer(1, 12))
        
    doc.build(story)
