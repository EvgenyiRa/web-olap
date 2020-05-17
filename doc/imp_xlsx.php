<?php
require_once(realpath('../get-data-func.php'));
session_start();
if (!$_SESSION['user_info']) {
    exit();
}

function get_content_Types_xml($file_str) {
    /*подключение файлов с указанием типов*/
    $file_str_new=$file_str.'[Content_Types].xml';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>';
    /*$xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            . '<Default Extension="bin" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings"/>'
            . '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>'
            . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            . '<Default Extension="xml" ContentType="application/xml"/>'*/   
            //графики (должно быть динамическое подключение)
           /* . '<Override PartName="/xl/charts/chart2.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
            . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            . '<Default Extension="xml" ContentType="application/xml"/>'
            . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            //графики
            . '<Override PartName="/xl/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
            . '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
           //графики
            . '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>'
            . '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
            . '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            //подключение формул (отсутствие файла не влияет на ошибку)
            . '<Override PartName="/xl/calcChain.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml"/>'            
            . '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'*/;
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f);   
}

function get_core_xml($file_str) {
    $file_str_new=$file_str.'docProps/core.xml';
    /*$xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                    <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator></dc:creator><cp:lastModifiedBy></cp:lastModifiedBy>
                        <dcterms:created xsi:type="dcterms:W3CDTF">'.date('Y\-m\-d\TH\:i\:s\Z').'</dcterms:created>
                        <dcterms:modified xsi:type="dcterms:W3CDTF">'.date('Y\-m\-d\TH\:i\:s\Z').'</dcterms:modified>
                    </cp:coreProperties>';*/
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title></dc:title><dc:subject></dc:subject><dc:creator></dc:creator><cp:keywords></cp:keywords><dc:description></dc:description><cp:lastModifiedBy></cp:lastModifiedBy><cp:revision></cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">'.date('Y\-m\-d\TH\:i\:s\Z').'</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">'.date('Y\-m\-d\TH\:i\:s\Z').'</dcterms:modified><cp:category></cp:category><cp:contentStatus></cp:contentStatus></cp:coreProperties>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f);   
}


function get_sharedStrings_beg_xml($file_str,$xml_list_v) {
    $file_str_new=$file_str.'xl/sharedStrings.xml';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list_v); 
    // Закрыть текстовый файл
    fclose($f);       
}

function one_row_calc_chain($tr) {
    return '<c r="B'.$tr.'"/>'
         . '<c r="D'.$tr.'"/>';    
}


function get_chart_xml($file_str,$num,$num_str,$e_value) {
    /*файл описания графика (1 график=1 файл)*/
    $file_str_new=$file_str.'xl/charts/chart'.$num.'.xml';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<c:lang val="ru-RU"/>
<c:chart>
<c:plotArea>
<c:layout/>
<c:barChart>
	<c:barDir val="bar"/>
	<c:grouping val="clustered"/>
	<c:ser>
		<c:idx val="1"/>
		<c:order val="0"/>
		<c:spPr>
			<a:solidFill>
				<a:srgbClr val="993366"/>
			</a:solidFill>
			<a:ln w="12700">
			<a:solidFill>
			<a:srgbClr val="000000"/>
			</a:solidFill>
			<a:prstDash val="solid"/>
			</a:ln>
		</c:spPr>
		<c:val>
			<c:numRef>
				<c:f>\'true export\'!$E$2</c:f>
				<c:numCache>
				<c:formatCode>0</c:formatCode>
				<c:ptCount val="1"/>
				<c:pt idx="0">
					<c:v>1500</c:v>
				</c:pt></c:numCache>
			</c:numRef>
		</c:val></c:ser><c:ser>
		<c:idx val="0"/>
		<c:order val="1"/>
			<c:spPr>
				<a:solidFill><a:srgbClr val="9999FF"/>
			</a:solidFill>
			<a:ln w="12700">
				<a:solidFill>
					<a:srgbClr val="000000"/>
				</a:solidFill>
				<a:prstDash val="solid"/>
			</a:ln>
			</c:spPr>
		<c:val>
			<c:numRef>
				<c:f>\'true export\'!$D$'.$num_str.'</c:f>
				<c:numCache>
					<c:formatCode>0.00</c:formatCode>
					<c:ptCount val="1"/>
					<c:pt idx="0">
					<c:v>'.$e_value.'</c:v></c:pt>
				</c:numCache>
			</c:numRef>
		</c:val>
	</c:ser>
	<c:axId val="63112320"/>
	<c:axId val="63113856"/>
</c:barChart>
<c:catAx>
<c:axId val="63112320"/>
<c:scaling>
	<c:orientation val="minMax"/>
</c:scaling>
<c:delete val="1"/>
<c:axPos val="l"/>
<c:tickLblPos val="nextTo"/>
<c:crossAx val="63113856"/>
<c:crosses val="autoZero"/>
<c:auto val="1"/>
<c:lblAlgn val="ctr"/>
<c:lblOffset val="100"/>
</c:catAx><c:valAx>
<c:axId val="63113856"/>
<c:scaling>
	<c:orientation val="minMax"/>
</c:scaling><c:delete val="1"/>
<c:axPos val="b"/><c:numFmt formatCode="0" sourceLinked="1"/>
<c:tickLblPos val="nextTo"/>
<c:crossAx val="63112320"/>
<c:crosses val="autoZero"/>
<c:crossBetween val="between"/>
</c:valAx>
<c:spPr>
<a:solidFill>
<a:srgbClr val="C0C0C0"/>
</a:solidFill>
<a:ln w="12700">
<a:solidFill>
<a:srgbClr val="808080"/>
</a:solidFill>
<a:prstDash val="solid"/>
</a:ln>
</c:spPr>
</c:plotArea>
<c:plotVisOnly val="1"/>
<c:dispBlanksAs val="gap"/>
</c:chart>
<c:spPr>
<a:solidFill>
<a:srgbClr val="FFFFFF"/>
</a:solidFill>
<a:ln w="9525">
<a:noFill/>
</a:ln>
</c:spPr>
<c:txPr>
<a:bodyPr/>
<a:lstStyle/>
<a:p>
<a:pPr>
<a:defRPr sz="100" b="0" i="0" u="none" strike="noStrike" baseline="0">
<a:solidFill>
<a:srgbClr val="000000"/>
</a:solidFill>
<a:latin typeface="Arial Cyr"/>
<a:ea typeface="Arial Cyr"/>
<a:cs typeface="Arial Cyr"/>
</a:defRPr>
</a:pPr>
<a:endParaRPr lang="ru-RU"/>
</a:p>
</c:txPr>
<c:printSettings>
<c:headerFooter alignWithMargins="0"/>
<c:pageMargins b="1" l="0.75" r="0.75" t="1" header="0.5" footer="0.5"/>
<c:pageSetup paperSize="9" orientation="landscape"/>
</c:printSettings></c:chartSpace>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f); 
}

function get_drawing1_xml_rels($file_str,$num,$num_str,$e_value) {
    /*файл описания размещения файлов графиков*/
    $file_str_new=$file_str.'xl/drawings/_rels/drawing1.xml.rels';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart2.xml"/>
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>
</Relationships>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f);
}  

function get_drawing1_xml($file_str,$num,$num_str,$e_value) {
    /*файл описания размещения графиков*/
    $file_str_new=$file_str.'xl/drawings/drawing1.xml';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
	<xdr:twoCellAnchor>
		<xdr:from>
			<xdr:col>4</xdr:col>
			<xdr:colOff>9525</xdr:colOff>
			<xdr:row>4</xdr:row>
			<xdr:rowOff>9525</xdr:rowOff>
		</xdr:from>
		<xdr:to>
			<xdr:col>4</xdr:col>
			<xdr:colOff>590550</xdr:colOff>
			<xdr:row>4</xdr:row>
			<xdr:rowOff>276225</xdr:rowOff>
		</xdr:to>
		<xdr:graphicFrame macro="">
			<xdr:nvGraphicFramePr>
			<xdr:cNvPr id="1028" name="Chart 4"/>
			<xdr:cNvGraphicFramePr>
				<a:graphicFrameLocks/>
			</xdr:cNvGraphicFramePr>
			</xdr:nvGraphicFramePr>
			<xdr:xfrm>
				<a:off x="0" y="0"/>
				<a:ext cx="0" cy="0"/>
			</xdr:xfrm>
			<a:graphic>
				<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
					<c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId1"/>
				</a:graphicData>
			</a:graphic>
		</xdr:graphicFrame>
		<xdr:clientData/>
	</xdr:twoCellAnchor>
	<xdr:twoCellAnchor>
		<xdr:from>
			<xdr:col>4</xdr:col>
			<xdr:colOff>28575</xdr:colOff>
			<xdr:row>5</xdr:row>
			<xdr:rowOff>38100</xdr:rowOff>
		</xdr:from>
		<xdr:to>
			<xdr:col>4</xdr:col>
			<xdr:colOff>619125</xdr:colOff>
			<xdr:row>5</xdr:row>
			<xdr:rowOff>333375</xdr:rowOff>
		</xdr:to>
		<xdr:graphicFrame macro="">
			<xdr:nvGraphicFramePr>
				<xdr:cNvPr id="1029" name="Chart 5"/>
				<xdr:cNvGraphicFramePr>
					<a:graphicFrameLocks/>
				</xdr:cNvGraphicFramePr>
			</xdr:nvGraphicFramePr>
			<xdr:xfrm>
				<a:off x="0" y="0"/>
				<a:ext cx="0" cy="0"/>
			</xdr:xfrm>
			<a:graphic>
				<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
					<c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId2"/>
				</a:graphicData>
			</a:graphic>
		</xdr:graphicFrame>
		<xdr:clientData/>
	</xdr:twoCellAnchor>
</xdr:wsDr>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f);
} 


function get_sheet_xml($file_str) {
    if (!is_dir($file_str.'xl')) {
        mkdir($file_str.'xl');
        mkdir($file_str.'xl/worksheets');
    }
    $file_str_new=$file_str.'xl/worksheets/sheet1.xml';
    $file_str_new2=$file_str.'xl/calcChain.xml';
    get_sharedStrings_beg_xml($file_str,$_POST['get_sharedStrings_beg_xml']);
     $f = fopen($file_str_new, "w+");
    fwrite($f, $_POST['get_sheet_xml']); 
    // Закрыть текстовый файл
    fclose($f); 
} 

function get_styles_xml($file_str,$xml_style_list) {
    /*файл стилей (неправильное указание влиет на возникновение ошибки)*/
    $file_str_new=$file_str.'xl/styles.xml'; 
    $xml_list=$xml_style_list;
    /*$xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision">'.
    '<fonts count="1">'
        . '<font><sz val="11"/>'
            . '<color theme="1"/>'
            . '<name val="Calibri"/>'
            . '<family val="2"/>'
            . '<scheme val="minor"/>'
        . '</font>'
    . '</fonts>'
    . '<fills count="2">'
        . '<fill>'
            . '<patternFill patternType="none"/>'
        . '</fill>'
        . '<fill><patternFill patternType="gray125"/>'
        . '</fill>'
    . '</fills>'
    . '<borders count="1">'
        . '<border>'
            . '<left/><right/><top/><bottom/><diagonal/>'
        . '</border>'
        . '</borders>'
        . '<cellStyleXfs count="1">'
            . '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
        . '</cellStyleXfs>'
        . '<cellXfs count="1">'
            . '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
        . '</cellXfs><cellStyles count="1">'
        . '<cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
        . '<dxfs count="0"/>'
        . '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9"/>'
        . '<extLst>'
            . '<ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/>'
            . '</ext>'
        . '</extLst>'
. '</styleSheet>';*/

    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f); 
} 

function get_workbook_xml($file_str) {
    $file_str_new=$file_str.'xl/workbook.xml';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15 xr xr6 xr10 xr2" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6" xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"><fileVersion appName="xl" lastEdited="7" lowestEdited="4" rupBuild="21125"/><workbookPr defaultThemeVersion="166925"/><xr:revisionPtr revIDLastSave="0" documentId="8_{D1F3E85A-D9C2-4BC8-B58C-13393ED4E791}" xr6:coauthVersionLast="40" xr6:coauthVersionMax="40" xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"/><bookViews><workbookView xWindow="240" yWindow="105" windowWidth="14805" windowHeight="8010" xr2:uid="{00000000-000D-0000-FFFF-FFFF00000000}"/></bookViews><sheets><sheet name="Лист1" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191028"/><extLst><ext uri="{B58B0392-4F1F-4190-BB64-5DF3571DCE5F}" xmlns:xcalcf="http://schemas.microsoft.com/office/spreadsheetml/2018/calcfeatures"><xcalcf:calcFeatures><xcalcf:feature name="microsoft.com:RD"/></xcalcf:calcFeatures></ext></extLst></workbook>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f); 
}

function get_sheet1_xml_rels($file_str) {
    /*необходимо для каждого листа генерировать автоматически (при наличии больше одного)*/
    $file_str_new=$file_str.'xl/worksheets/_rels/sheet1.xml.rels';
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings" Target="../printerSettings/printerSettings1.bin"/></Relationships>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f); 
}

function get_workbook_xml_rels($file_str) {
    /*указание файлов стиля, тем, разметки страницы , формул (отсутсвие не вызывает ошибки), уникальных строк */
    $file_str_new=$file_str.'xl/_rels/workbook.xml.rels';
    /*$xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . ' <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            . ' <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>'
            . ' <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            . ' <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/calcChain" Target="calcChain.xml"/>'
            . ' <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>';*/
    $xml_list='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>';
    $f = fopen($file_str_new, "w+");
    // Записать текст
    fwrite($f, $xml_list); 
    // Закрыть текстовый файл
    fclose($f); 
}

    set_time_limit(10000);
    ini_set('memory_limit', '1256M');
    $user=json_decode($_SESSION['user_info'],true);
    
    $dir_f20=realpath('/index.php').'xlsx/'.$_POST["get_report"];
    $dir_f21=$user['USER_ID'].'_'.$_POST['in_rep_id'];
    //создаем директорию аналог "эталонной" в рамках текущего пользователя/отчета
    copy_folder($dir_f20.'/arhive', $dir_f20.'/'.$dir_f21.'/arhive');
    
    $dir_f2=$dir_f20.'/'.$dir_f21.'/arhive/';
    
    $dir_f=$dir_f20.'/'.$dir_f21.'/';

    get_content_Types_xml($dir_f2);
    get_workbook_xml_rels($dir_f2);
    get_styles_xml($dir_f2,$_POST["get_styles_xml"]);
    get_sheet_xml($dir_f2);
    get_workbook_xml($dir_f2);
    get_core_xml($dir_f2);

    $zip = new ZipArchive();
    $file=$dir_f.$_POST["get_report"].'.ZIP';
    $file_xlsx=$dir_f.$_POST["real_name"].'.XLSX';
    $file_net='/xlsx/'.$_POST["get_report"].'/'.$dir_f21.'/'.$_POST["real_name"].'.XLSX';
    if (file_exists($file)) {
        unlink($file);
    }
    if (file_exists($file_xlsx)) {
        unlink($file_xlsx);
    }
    $pathdir=substr($dir_f2, 0, -1);
    $zip = new ZipArchive;
    if ($zip -> open($file, ZipArchive::CREATE) === TRUE)
    {
        $dir = opendir( $pathdir );
        $i=1;
        $mass_type[1]='.xml';
        $mass_type[2]='.rels';
        $mass_type[3]='.bin';
        $count_type=3;
        while( $d = readdir( $dir ) ){
            $is_file=false;
            for ($i = 1; $i <= $count_type; $i++) {
                if ((strripos($d, $mass_type[$i])) or ($d2==$mass_type[$i])) {
                    $is_file=true; 
                    break;
                }
            }
            if ($is_file) {           
                $zip -> addFile( $pathdir.'/'.$d, $d);
            }
            elseif ((iconv_strlen($d,'UTF-8')>1) & ($d<>'..')) {
                /*создаем дирректорию*/
                $zip->addEmptyDir($d);          
                $dir2 = opendir( $pathdir.'/'.$d);
                while( $d2 = readdir( $dir2 ) ){
                    $is_file=false;
                    for ($i = 1; $i <= $count_type; $i++) {
                        if ((strripos($d2, $mass_type[$i])) or ($d2==$mass_type[$i])) {
                            $is_file=true;
                            break;
                        }
                    }
                    if ($is_file) {              
                        $zip -> addFile( $pathdir.'/'.$d.'/'.$d2, $d.'/'.$d2);
                    }
                    elseif ((iconv_strlen($d2,'UTF-8')>1) & ($d2<>'..')) {
                        /*создаем дирректорию*/                 
                        $zip->addEmptyDir($d.'/'.$d2);                
                        $dir3 = opendir($pathdir.'/'.$d.'/'.$d2);
                        while( $d3 = readdir( $dir3 ) ){
                            $is_file=false;
                            for ($i = 1; $i <= $count_type; $i++) {
                                if ((strripos($d3, $mass_type[$i])) or ($d3==$mass_type[$i])) {
                                    $is_file=true;
                                    break;
                                }
                            }
                            if ($is_file) {                            
                                $zip -> addFile( $pathdir.'/'.$d.'/'.$d2.'/'.$d3, $d.'/'.$d2.'/'.$d3);
                            }
                            elseif ((iconv_strlen($d3,'UTF-8')>1) & ($d3<>'..')) {
                                /*создаем дирректорию*/
                                $zip->addEmptyDir($d.'/'.$d2.'/'.$d3);                            
                                $dir4 = opendir( $pathdir.'/'.$d.'/'.$d2.'/'.$d3);
                                while( $d4 = readdir( $dir4 ) ){
                                    $is_file=false;
                                    for ($i = 1; $i <= $count_type; $i++) {
                                        if ((strripos($d4, $mass_type[$i])) or ($d4==$mass_type[$i])) {
                                            $is_file=true;
                                            break;
                                        }
                                    }
                                    if ($is_file) {                                  
                                        $zip -> addFile( $pathdir.'/'.$d.'/'.$d2.'/'.$d3.'/'.$d4, $d.'/'.$d2.'/'.$d3.'/'.$d4);
                                    }
                                    elseif ((iconv_strlen($d4,'UTF-8')>1) & ($d4<>'..')) {                            
                                        $zip->addEmptyDir($d.'/'.$d2.'/'.$d3.'/'.$d4);                               
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }    
        $zip -> close();
    }

    if(file_exists($file) && is_file($file)) {       
        if (ob_get_level()) {
          ob_end_clean();
        }  
        rename($file,$file_xlsx);  
        echo $file_net;
    }
            
?>