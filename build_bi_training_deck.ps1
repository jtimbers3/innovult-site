$ErrorActionPreference = 'Stop'

$template = 'C:\Users\jtimb\OneDrive\innovult\Engagements\TSA\Deliverables\TFDW_ITSC Weekly Recap_WE20260301.pptx'
$outDeck = 'C:\Users\jtimb\Downloads\TFDW_BI_Training_Starter_From_TeamsVideo.pptx'
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
    @{ t='Business Intelligence Training Starter (from Teams recording)'; b=@('Purpose: establish repeatable BI workflow and analyst standards','Audience: BI analysts, report developers, product owners','Output: step-by-step runbook + examples + QA checklist'); img='frame-005.jpg' },
    @{ t='Training Map (Non-chronological Modules)'; b=@('Module A: Environment & Access','Module B: Data Connection & Profiling','Module C: Modeling & Calculations','Module D: Reporting, QA, and Publish'); img='frame-015.jpg' },
    @{ t='Module A — Environment & Access'; b=@('Confirm tool access (workspace, data source, permissions)','Validate refresh/service account readiness','Document environment assumptions before build begins'); img='frame-025.jpg' },
    @{ t='Module A — Workspace & File Hygiene'; b=@('Use standard naming conventions for files/pages/measures','Create folder structure for sources, transformed data, outputs','Track change history and owner on each iteration'); img='frame-035.jpg' },
    @{ t='Module B — Connect to Source Data'; b=@('Connect using approved connector/method','Capture source metadata and extraction timestamp','Record any filtering parameters used during ingest'); img='frame-045.jpg' },
    @{ t='Module B — Data Profiling & Quality Checks'; b=@('Check nulls, duplicates, key uniqueness, and date coverage','Identify outliers and business-rule violations early','Log issues and route unresolved items to data owners'); img='frame-055.jpg' },
    @{ t='Module C — Transformation Standards'; b=@('Apply repeatable transformations with clear naming','Separate raw, cleansed, and business-ready layers','Keep logic transparent so another analyst can reproduce'); img='frame-065.jpg' },
    @{ t='Module C — Data Model Design'; b=@('Define star-schema style relationships where possible','Validate granularity alignment before joining datasets','Create a field dictionary for shared understanding'); img='frame-075.jpg' },
    @{ t='Module C — Measures / Calculations'; b=@('Define business formulas with plain-language descriptions','Test measures against known control totals','Flag assumptions directly in model documentation'); img='frame-085.jpg' },
    @{ t='Module D — Visual Design & Storytelling'; b=@('Build visuals to answer business questions, not just show data','Use consistent colors, labels, and KPI formatting','Prioritize executive summary views + drill-down paths'); img='frame-095.jpg' },
    @{ t='Module D — Validation, UAT, and Publish'; b=@('Run QA checklist (totals, filters, edge cases, performance)','Capture user acceptance feedback and action items','Publish with versioning and support owner assigned'); img='frame-105.jpg' },
    @{ t='Operational Runbook (What to do every week)'; b=@('Refresh data and validate control totals','Review KPI shifts and explain key deltas','Publish recap + risks + next actions in weekly cadence'); img='frame-113.jpg' }
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