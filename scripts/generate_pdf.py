import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

pdf_path = r"c:\Users\dhame\Desktop\tesca_website\public\material\Nova-Scotia-PR-Pathway-Guide.pdf"
os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

# Page Setup
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Colors matching TESCA design system & PDF screenshots
NAVY_HEADER = colors.HexColor("#1A2B4C")
BLUE_ACCENT = colors.HexColor("#2563EB")
TEXT_DARK = colors.HexColor("#1E293B")
TEXT_MUTED = colors.HexColor("#475569")
CARD_BG = colors.HexColor("#F8FAFC")
CARD_BORDER = colors.HexColor("#E2E8F0")
HIGHLIGHT_BG = colors.HexColor("#F0FDFA")
HIGHLIGHT_BORDER = colors.HexColor("#0D9488")
TEAL_ACCENT = colors.HexColor("#0F766E")

# Custom Typography Styles
title_style = ParagraphStyle(
    'HeaderTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=colors.white,
    alignment=TA_CENTER
)

subtitle_style = ParagraphStyle(
    'HeaderSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor("#CBD5E1"),
    alignment=TA_CENTER
)

intro_style = ParagraphStyle(
    'IntroText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10.5,
    leading=15,
    textColor=TEXT_MUTED,
    spaceAfter=12
)

h1_style = ParagraphStyle(
    'SectionH1',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=15,
    leading=19,
    textColor=NAVY_HEADER,
    spaceBefore=12,
    spaceAfter=10
)

card_title_style = ParagraphStyle(
    'CardTitle',
    parent=styles['Heading3'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=BLUE_ACCENT,
    spaceAfter=4
)

card_noc_style = ParagraphStyle(
    'CardNoc',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13,
    textColor=NAVY_HEADER,
    spaceAfter=8
)

body_style = ParagraphStyle(
    'BodyDark',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=14,
    textColor=TEXT_DARK
)

bullet_style = ParagraphStyle(
    'BulletItem',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=14,
    textColor=TEXT_DARK,
    leftIndent=10,
    firstLineIndent=-10,
    spaceAfter=5
)

callout_style = ParagraphStyle(
    'CalloutText',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    textColor=TEAL_ACCENT
)

disclaimer_style = ParagraphStyle(
    'DisclaimerText',
    parent=styles['Italic'],
    fontName='Helvetica-Oblique',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor("#64748B"),
    alignment=TA_CENTER
)

story = []

# --- HEADER BANNER ---
header_data = [
    [Paragraph("Nova Scotia PR Pathway Guide", title_style)],
    [Paragraph("Continuing Care Assistant (CCA) & Early Childhood Educator (ECE)", subtitle_style)]
]
header_table = Table(header_data, colWidths=[540])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), NAVY_HEADER),
    ('PADDING', (0,0), (-1,-1), 16),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('BOTTOMPADDING', (0,0), (-1,0), 4),
    ('TOPPADDING', (0,1), (-1,1), 4),
]))
story.append(header_table)
story.append(Spacer(1, 16))

# --- INTRO TEXT ---
intro_p = Paragraph(
    "<b>Welcome!</b> As requested, here are the complete details about the highly sought-after PR pathways in "
    "Nova Scotia, Canada, specifically designed for students pursuing careers in healthcare and early childhood education. "
    "This route requires <b>no previous relevant experience</b> and offers a direct pathway to Canadian Permanent Residency.",
    intro_style
)
story.append(intro_p)
story.append(Spacer(1, 8))

# --- SECTION 1: THE PROGRAMS ---
story.append(Paragraph("1. The Programs: CCA and ECE", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=CARD_BORDER, spaceBefore=2, spaceAfter=12))

# CCA Card Content
cca_content = [
    Paragraph("Continuing Care Assistant (CCA)", card_title_style),
    Paragraph("NOC Code: 33102 [1]", card_noc_style),
    Paragraph("Continuing Care Assistants provide essential daily living support to individuals in long-term care facilities, hospitals, and home care environments. With Nova Scotia's aging population, CCAs are in massive demand.", body_style),
    Spacer(1, 6),
    Paragraph("• <b>Duration:</b> Typically 30 to 40 weeks (less than 1 year).", bullet_style),
    Paragraph("• <b>Certification:</b> Graduates must pass the provincial CCA certification exam.", bullet_style),
    Paragraph("• <b>Why Choose CCA:</b> Extremely fast placement, urgent provincial need, hands-on healthcare role.", bullet_style),
]

# ECE Card Content
ece_content = [
    Paragraph("Early Childhood Educator (ECE)", card_title_style),
    Paragraph("NOC Code: 42202 [1]", card_noc_style),
    Paragraph("Early Childhood Educators plan and lead activities for preschool and school-aged children. The province is heavily investing in affordable child care, creating a critical shortage of certified educators.", body_style),
    Spacer(1, 6),
    Paragraph("• <b>Duration:</b> Usually 1 to 2 years (Diploma program).", bullet_style),
    Paragraph("• <b>Certification:</b> Level 1, 2, or 3 ECE classification by the provincial government upon graduation.", bullet_style),
    Paragraph("• <b>Why Choose ECE:</b> Rewarding career, government-supported wage increases, family-friendly work hours.", bullet_style),
]

cards_data = [[cca_content, ece_content]]
cards_table = Table(cards_data, colWidths=[262, 262])
cards_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), CARD_BG),
    ('BACKGROUND', (1,0), (1,0), CARD_BG),
    ('BOX', (0,0), (0,0), 1, CARD_BORDER),
    ('BOX', (1,0), (1,0), 1, CARD_BORDER),
    ('PADDING', (0,0), (-1,-1), 12),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(cards_table)
story.append(Spacer(1, 18))

# Page Break for clean multi-page document structure
story.append(PageBreak())

# --- SECTION 2: THE PR PATHWAY ---
story.append(Paragraph("2. The PR Pathway: International Graduates in Demand Stream", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=CARD_BORDER, spaceBefore=2, spaceAfter=10))

pr_intro = Paragraph(
    "The <b>Nova Scotia International Graduates in Demand Stream</b> is uniquely designed to fast-track "
    "permanent residency for international students who study specifically in these high-demand fields [1].",
    body_style
)
story.append(pr_intro)
story.append(Spacer(1, 10))

# Callout Box
callout_data = [[
    Paragraph("<b>The Best Part:</b> You do NOT need years of previous work experience [1]. The main criteria are your local Nova Scotia education and a job offer!", callout_style)
]]
callout_table = Table(callout_data, colWidths=[540])
callout_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), HIGHLIGHT_BG),
    ('BOX', (0,0), (-1,-1), 1, HIGHLIGHT_BORDER),
    ('LINELEFT', (0,0), (-1,-1), 4, HIGHLIGHT_BORDER),
    ('PADDING', (0,0), (-1,-1), 10),
]))
story.append(callout_table)
story.append(Spacer(1, 12))

req_title = Paragraph("<b>Key Eligibility Requirements:</b>", ParagraphStyle('ReqTitle', parent=body_style, fontName='Helvetica-Bold', fontSize=10.5, spaceAfter=6))
story.append(req_title)

story.append(Paragraph("• <b>Education:</b> You must have completed a program of study in Nova Scotia related to the in-demand occupation (CCA or ECE). The program must be at least 30 weeks in length [1].", bullet_style))
story.append(Paragraph("• <b>Job Offer:</b> You need a full-time, permanent job offer from a Nova Scotia employer in your respective NOC code (33102 for CCA or 42202 for ECE) [1].", bullet_style))
story.append(Paragraph("• <b>Language Proficiency:</b> Minimum of CLB 5 (Canadian Language Benchmark) in English or French [1] (e.g., IELTS General - Reading 4.0, Writing 5.0, Listening 5.0, Speaking 5.0).", bullet_style))
story.append(Paragraph("• <b>Certifications:</b> Possess the necessary regulatory certifications issued by a Nova Scotia regulatory body [1].", bullet_style))
story.append(Paragraph("• <b>Intent:</b> Genuine intention to reside in Nova Scotia permanently [1].", bullet_style))

story.append(Spacer(1, 16))

# --- SECTION 3: WHERE TO STUDY ---
story.append(Paragraph("3. Where to Study: Recommended Colleges", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=CARD_BORDER, spaceBefore=2, spaceAfter=10))

college_intro = Paragraph(
    "To qualify for this stream, you must graduate from a designated institution in Nova Scotia [1]. Popular choices for international students include:",
    body_style
)
story.append(college_intro)
story.append(Spacer(1, 10))

# College 1: NSCC
nscc_content = [
    Paragraph("Nova Scotia Community College (NSCC)", ParagraphStyle('Col1', parent=card_title_style, fontSize=11, textColor=BLUE_ACCENT)),
    Spacer(1, 4),
    Paragraph("A public, highly reputable institution offering both CCA and ECE programs across multiple campuses in the province [1]. <i>Note: As a public college, graduates are also eligible for the Post-Graduation Work Permit (PGWP).</i>", body_style)
]
nscc_table = Table([ [nscc_content] ], colWidths=[540])
nscc_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
    ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
    ('PADDING', (0,0), (-1,-1), 10),
]))
story.append(nscc_table)
story.append(Spacer(1, 8))

# College 2: Willis College
willis_content = [
    Paragraph("Willis College (formerly CBBC Career College)", ParagraphStyle('Col2', parent=card_title_style, fontSize=11, textColor=BLUE_ACCENT)),
    Spacer(1, 4),
    Paragraph("A private college with campuses in Halifax, Dartmouth, and Sydney. They offer fast-tracked, industry-recognized CCA and ECE programs [1]. <i>Note: While private college graduates generally do not get a standard PGWP, they are perfectly eligible to apply for PR via the International Graduates in Demand Stream once they secure a job offer [1].</i>", body_style)
]
willis_table = Table([ [willis_content] ], colWidths=[540])
willis_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
    ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
    ('PADDING', (0,0), (-1,-1), 10),
]))
story.append(willis_table)
story.append(Spacer(1, 8))

# College 3: NSCECE
nscece_content = [
    Paragraph("Nova Scotia College of Early Childhood Education (NSCECE)", ParagraphStyle('Col3', parent=card_title_style, fontSize=11, textColor=BLUE_ACCENT)),
    Spacer(1, 4),
    Paragraph("Located in Halifax, this institution is exclusively dedicated to Early Childhood Education [1]. It is highly respected and offers exceptional hands-on practicum placements for ECE students.", body_style)
]
nscece_table = Table([ [nscece_content] ], colWidths=[540])
nscece_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
    ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
    ('PADDING', (0,0), (-1,-1), 10),
]))
story.append(nscece_table)

story.append(Spacer(1, 16))
story.append(PageBreak())

# --- SECTION 4: ROADMAP TO PR ---
story.append(Paragraph("4. Your Roadmap to PR", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=CARD_BORDER, spaceBefore=2, spaceAfter=12))

steps = [
    ("1. Apply for Admission:", "Secure an acceptance letter from an eligible Nova Scotia college for the CCA or ECE program."),
    ("2. Study & Network:", "Complete your program (usually 1-2 years). Build connections during your practicum placements."),
    ("3. Get Certified:", "Obtain your provincial CCA or ECE certification right after graduation."),
    ("4. Secure a Job Offer:", "Receive a full-time, permanent job offer from a local employer [1]."),
    ("5. Apply for PR:", "Submit your application for a provincial nomination under the Nova Scotia International Graduates in Demand stream, and subsequently apply for Canadian Permanent Residency! [1]")
]

for title, desc in steps:
    step_para = Paragraph(f"<b>{title}</b> {desc}", bullet_style)
    story.append(step_para)
    story.append(Spacer(1, 4))

story.append(Spacer(1, 30))

# --- DISCLAIMER ---
disclaimer_para = Paragraph(
    "<i>Disclaimer: Immigration programs and requirements are subject to change. "
    "Always refer to official Nova Scotia Immigration guidelines or consult a licensed immigration professional before making decisions.</i>",
    disclaimer_style
)
story.append(disclaimer_para)

doc.build(story)
print(f"PDF generated successfully at: {pdf_path}")
