$ErrorActionPreference = 'Stop'

$template = 'C:\Users\jtimb\OneDrive\innovult\Engagements\TSA\Deliverables\TFDW_ITSC Weekly Recap_WE20260301.pptx'
$outDeck = 'C:\Users\jtimb\Downloads\TFDW_BI_Training_Starter_From_TeamsVideo_v2.pptx'
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
    @{ t='Introduction'; b=@('Purpose: provide a practical starter guide for BI reporting workflows','Audience: analysts, report developers, and business owners','Goal: create repeatable, quality-controlled reporting habits'); img='frame-004.jpg' },
    @{ t='Logging In'; b=@('Open the BI tool and authenticate with approved credentials','Confirm workspace access and role permissions','If access fails: verify VPN/network and account entitlements'); img='frame-012.jpg' },
    @{ t='Navigation'; b=@('Identify main menu areas: workspace, datasets, reports, and settings','Use search and favorites to quickly locate content','Follow naming standards to avoid selecting wrong assets'); img='frame-022.jpg' },
    @{ t='Filters'; b=@('Apply page/report filters in a consistent order','Validate date range and key dimension filters before analysis','Save or document filter states used for recurring reports'); img='frame-034.jpg' },
    @{ t='Reports'; b=@('Open report pages and review KPI definitions before interpretation','Check visual-level logic and drill-down paths','Use control totals to validate the report is accurate'); img='frame-048.jpg' },
    @{ t='Running Reports'; b=@('Set required parameters and run the report','Monitor query/refresh status and confirm completion','Capture notable variances and add business context notes'); img='frame-064.jpg' },
    @{ t='Exporting Data'; b=@('Export to approved format (CSV/XLSX/PDF) based on audience need','Validate row counts and key totals post-export','Store outputs in approved location with version/date naming'); img='frame-078.jpg' },
    @{ t='Quality Checks Before Sharing'; b=@('Reconcile totals against source/control report','Check labels, date stamps, and confidentiality markings','Have a second reviewer validate high-impact reports'); img='frame-092.jpg' },
    @{ t='Weekly BI Operating Rhythm'; b=@('Refresh, validate, analyze, and publish on a fixed cadence','Track open data issues and assign owners','Maintain a change log for report logic and assumptions'); img='frame-108.jpg' },
    @{ t='Next Steps'; b=@('Convert these modules into standard onboarding material','Add role-based exercises for analysts and leads','Build a BI SOP library from this training baseline'); img='frame-113.jpg' }
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