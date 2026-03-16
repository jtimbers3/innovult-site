$ErrorActionPreference = 'Stop'

$template = 'C:\Users\jtimb\OneDrive\innovult\Engagements\TSA\Deliverables\TFDW_ITSC Weekly Recap_WE20260301.pptx'
$outDeck = 'C:\Users\jtimb\Downloads\TFDW_BI_Training_JobAid_From_TeamsVideo_v3.pptx'
$framesDir = 'C:\Users\jtimb\.openclaw\workspace\video_frames'

Copy-Item -LiteralPath $template -Destination $outDeck -Force

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = -1
$pres = $ppt.Presentations.Open($outDeck, $false, $false, $true)

function Add-TrainingSlide {
    param(
        [string]$Title,
        [string[]]$Bullets,
        [string]$ImagePath
    )

    # 2 = ppLayoutText
    $slide = $pres.Slides.Add($pres.Slides.Count + 1, 2)
    $slide.Shapes.Title.TextFrame.TextRange.Text = $Title

    $body = $slide.Shapes.Item(2).TextFrame.TextRange
    $body.Text = ($Bullets -join "`r`n")

    if (Test-Path $ImagePath) {
        $left = 420
        $top = 110
        $width = 500
        $height = 280
        $slide.Shapes.AddPicture($ImagePath, $false, $true, $left, $top, $width, $height) | Out-Null
    }

    return $slide
}

$slidesData = @(
    @{ t='Introduction to TFDW'; b=@('Audience: Budget Analysts, Accountants, CORs, and Program Offices','Use this job aid to complete common reporting tasks in Oracle Analytics Server','Focus: run reports correctly, avoid common errors, and export trusted data'); img='frame-004.jpg' },
    @{ t='Accessing the BI Environment'; b=@('Open the approved TFDW BI URL and sign in with your enterprise credentials','Confirm you can see the expected folders/dashboards after login','If access is denied, submit access request through your normal governance path'); img='frame-010.jpg' },
    @{ t='TFDW Home Page Overview'; b=@('Identify key areas: dashboard menu, report links, and status indicators','Use landing page links to jump directly to reporting areas','Tip: bookmark the landing page only (not deep links) for stable access'); img='frame-014.jpg' },
    @{ t='Checking Daily Data Load Status'; b=@('Open the load/status page or widget shown in the walkthrough','Verify latest load date/time before running analysis','If load is incomplete/stale, pause reporting and notify support'); img='frame-018.jpg' },
    @{ t='Navigating Dashboards'; b=@('Use dashboard tabs/links to move between functional report areas','Confirm you are in the correct dashboard before applying prompts','Best practice: keep one dashboard per browser tab to reduce confusion'); img='frame-024.jpg' },
    @{ t='Understanding Dashboard Page Layout'; b=@('Review page zones: prompts at top, results in center, controls on side/top','Identify where report tables, charts, and notes are displayed','Additional information needed to complete this slide.'); img='frame-028.jpg' },
    @{ t='Using Dashboard Prompts (Filters)'; b=@('Set required prompts first (example: fiscal year and organization)','Apply prompts in the order demonstrated to limit data volume early','Tip: broad prompts can slow performance and return hard-to-read outputs'); img='frame-033.jpg' },
    @{ t='Searching the List of Values (LOV)'; b=@('Use LOV search to find valid values instead of free-typing','Select exact values and confirm selections are applied before running','Tip: search by partial text/code when full value is unknown'); img='frame-037.jpg' },
    @{ t='Running Reports'; b=@('After prompts are set, click Apply/Run to execute the query','Wait for refresh to complete before interacting with results','If runtime is long, narrow filters and rerun'); img='frame-044.jpg' },
    @{ t='Running Reports — Performance Tips'; b=@('Start with a narrow period/org scope, then expand as needed','Avoid running multiple heavy dashboards simultaneously','Additional information needed to complete this slide.'); img='frame-048.jpg' },
    @{ t='Understanding Report Results'; b=@('Validate row counts, totals, and key fields against expected ranges','Interpret results in context of selected prompts and report logic','Capture anomalies for follow-up before sharing externally'); img='frame-054.jpg' },
    @{ t='Using View Selectors'; b=@('Use view selector controls to switch table/chart/summary views','Confirm that selected view still reflects current prompt values','Tip: verify same totals across views to ensure consistency'); img='frame-060.jpg' },
    @{ t='Exporting Report Data'; b=@('Use export controls to download data in approved format (CSV/XLSX/PDF)','Confirm export scope (current view vs full report) before downloading','Check exported totals match on-screen totals'); img='frame-068.jpg' },
    @{ t='Exporting Data — Validation Checklist'; b=@('Open exported file and verify date stamp, filters, and row counts','Apply file naming convention with report name + date/time','Store files only in approved locations for controlled data handling'); img='frame-074.jpg' },
    @{ t='Best Practices for Running Reports'; b=@('Always check data load status first','Apply minimum necessary filters before run','Document prompt values used when sharing report outputs'); img='frame-084.jpg' },
    @{ t='Common Errors and Troubleshooting'; b=@('Issue: no data returned -> verify prompts/LOV selections and rerun','Issue: stale data -> recheck daily load status and refresh','Issue: timeout/performance -> narrow filters and run smaller scope first'); img='frame-096.jpg' },
    @{ t='Common Errors — System Feedback Examples'; b=@('Capture exact error text/screenshot when issue occurs','Record dashboard name, prompts used, and time of failure','Additional information needed to complete this slide.'); img='frame-102.jpg' },
    @{ t='Getting Support'; b=@('Escalate with: dashboard name, prompts, timestamp, and screenshot','Include whether issue affects one report or multiple dashboards','Use designated BI support channel/process for fastest triage'); img='frame-110.jpg' },
    @{ t='Quick Reference: End-to-End Workflow'; b=@('1) Check load status  2) Navigate dashboard  3) Set prompts/LOV','4) Run report  5) Validate results  6) Export and share','Use this sequence every time to reduce rework and reporting errors'); img='frame-113.jpg' }
)

foreach ($s in $slidesData) {
    $imgPath = Join-Path $framesDir $s.img
    Add-TrainingSlide -Title $s.t -Bullets $s.b -ImagePath $imgPath | Out-Null
}

$pres.Save()
$pres.Close()
$ppt.Quit()

[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pres) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null

Write-Output "Created: $outDeck"