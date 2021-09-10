createReportClientsTable: function () {
        if ($.fn.DataTable.isDataTable('#tblClientReport')) {
            ClientReport.referredClientsTable.clear();
            ClientReport.referredClientsTable.destroy();
        }
        ClientReport.referredClientsTable = $("#tblClientReport").DataTable({
            "dom": "<'row'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-5 w-100'f><'col-sm-12 col-md-5 text-md-right text-sm-center'B>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            "language":
            {
                "processing": "<div class='overlay custom-loader-background'><i class='spinner-border text-light'></i></div>",
                "search": "<span  style='font-size:16px'><label class='d-none'>Search</label></sapn>",
                "searchPlaceholder": "Search records",
                "sLengthMenu": "_MENU_",
                "emptyTable": "No Record Found",
            },
            "responsive": true,
            "processing": true, // for show progress bar
            "serverSide": true, // for process server side
            "filter": true, // this is for disable filter (search box)
            "orderMulti": false, // for disable multiple column at once
            "ajax": {
                "url": "/Report/GetAllOsForClientReport",
                "type": "POST",
                "dataType": "json",
                "data": function (d) {

                    var businessId = $("#txtBusinessClientReport").val();
                    var contractId = $("#txtContractorClientReport").val();
                    var fromDate = $("#txtFromClientReport").val();
                    var toDate = $("#txtToClientReport").val();
                    var Type = $("#hdnType").val();
                    var FromDate = "";
                    var TODate = "";
                    FromDate = fromDate != "" ? moment(fromDate, "DD/MM/YYYY").format("YYYY/MM/DD") : "";
                    TODate = toDate != "" ? moment(toDate, "DD/MM/YYYY").format("YYYY/MM/DD") : "";

                    d.FromDate = FromDate;
                    d.ToDate = TODate;
                    d.businessId = businessId;
                    d.contractId = contractId;
                    d.Type = Type;
                },
            },
            "fnDrawCallback": function () {
                $(".chkToggle").bootstrapToggle({
                    on: 'Activated',
                    off: 'Deactivated',
                    size: 'sm'
                });
            },
            "columnDefs": [
                { responsivePriority: 1, targets: 0 },
                { responsivePriority: 2, targets: 1 },
                { responsivePriority: 3, targets: 2 },
                { responsivePriority: 4, targets: 3 },
                { responsivePriority: 5, targets: 4 },
                { responsivePriority: 6, targets: 5 },
                { responsivePriority: 7, targets: 6 },
                { responsivePriority: 8, targets: 7 },
                { responsivePriority: 9, targets: 8 },
                { responsivePriority: 10, targets: 9 },
                { responsivePriority: 11, targets: 10 },
                { responsivePriority: 12, targets: 11 },
                { responsivePriority: 13, targets: 12 },
                { responsivePriority: 14, targets: 13 },
                { responsivePriority: 15, targets: 14 },
                { responsivePriority: 16, targets: 15 },
                { responsivePriority: 17, targets: 16 }

            ],
            "columns": [
                { "data": "clientId", "name": "ClientId", "title": "Client Id", "sClass": "text-wrap", "bSortable": true },
                {
                    "data": "clientId", "name": "client.firstName", "title": "Name", "sClass": "text-wrap", "bSortable": true,
                    "mRender": function (data, type, row) {

                        return `${row.contractorClient.client.firstName} ${row.contractorClient.client.surName}`
                    },
                },
                { "data": "createdByName", "name": "client.CreatedBy", "title": "Practitioner", "sClass": "text-wrap", "bSortable": true },

                {
                    "data": "clientId", "name": "ServiceDate", "title": "Service Date", "sClass": "text-wrap", "bSortable": true,
                    "mRender": function (data, type, row) {

                        if (row.serviceDate != null) {
                            return moment(row.serviceDate).format('DD/MM/YYYY hh:mm A');
                        }
                        else {
                            return "";
                        }
                    },
                },
                { "data": "alliedHealthDisciplineeName", "name": "AlliedHealthDiscipline", "title": "Discipline", "sClass": "text-wrap", "bSortable": true },
                { "data": "socialActivities", "name": "socialActivities", "title": "Social activities", "sClass": "text-wrap", "bSortable": true },
                { "data": "changeInHealth", "name": "changeInHealth", "title": "Change in health", "sClass": "text-wrap", "bSortable": true },
                { "data": "qualityOfLife", "name": "qualityOfLife", "title": "Quality Of life", "sClass": "text-wrap", "bSortable": true },
                { "data": "oscontextName", "name": "oscontext", "title": "OS Context", "sClass": "text-wrap", "bSortable": true },
                { "data": "clientAttendName", "name": "clientAttend", "title": "Client attend", "sClass": "text-wrap", "bSortable": true },
                { "data": "modeOfServiceName", "name": "modeOfService", "title": "Mode of Service", "sClass": "text-wrap", "bSortable": true },
                { "data": "presentingConditionName", "name": "presentingCondition", "title": "Presenting condition", "sClass": "text-wrap", "bSortable": true },
                { "data": "servicelocation.serviceLocationName", "name": "servicelocationId", "title": "Service location", "sClass": "text-wrap", "bSortable": true },
                { "data": "smokingCessationAdviceName", "name": "smokingCessationAdvice", "title": "Smoking cessation", "sClass": "text-wrap", "bSortable": true },
                { "data": "adviceAboutHealthyWeightName", "name": "adviceAboutHealthyWeight", "title": "Healthy weight", "sClass": "text-wrap", "bSortable": true },
                { "data": "physicalActivityAdviceName", "name": "physicalActivityAdvice", "title": "Physical activity", "sClass": "text-wrap", "bSortable": true },
                { "data": "fallsPreventionAdviceName", "name": "fallsPreventionAdvice", "title": "Falls prevention", "sClass": "text-wrap", "bSortable": true },


            ],
            buttons: [
                {
                    text: '<i class="fas fa-download" style="font-size:20px"></i> CSV',
                    className: 'btn mh-btn-purple ml-1 mt-2 mr-1 mb-1 text-center',
                    attr: {
                        id: 'btnDownloadCSV',
                        title: 'Download CSV',
                        'data-toggle': 'tooltip'
                    },
                    action: function () {
                        $("#adminReport").submit();
                    }
                }
            ]
        });
        $("#tblClientReport_filter input").removeClass("form-control-sm").addClass("form-control-lg mr-0");
        $("#tblClientReport_length select").removeClass("custom-select custom-select-sm form-control-sm").addClass("form-control-lg");
        //Set tooltip on clients datatable
        layout.setDataTableToolTip('tblClientReport');
    },