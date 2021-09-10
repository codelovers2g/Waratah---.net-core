//Report Controller
public JsonResult GetAllOsForClientReport(IFormCollection clientReportFormData)
        {
            List<ClientReportVM> clientReportVM = null;
            try
            {
                var draw = clientReportFormData["draw"].ToString();

                clientReportVM = _contractorservice.GetAllOsForClientReport(clientReportFormData, out int clientCount, out int filterCount);
                return Json(new { draw, data = clientReportVM, RecordsFiltered = filterCount, RecordsTotal = clientCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return Json(new { data = clientReportVM });
            }
        }
		
		//ContractorService.cs
public List<ClientReportVM> GetAllOsForClientReport(IFormCollection clientReportFormData, out int clientCount, out int filterCount)
        {
            List<ClientReportVM> _return = new List<ClientReportVM>();

            //var ClientId = clientReportFormData["clientId"].FirstOrDefault();
            var start = clientReportFormData["start"].ToString();
            var length = clientReportFormData["length"].ToString();
            var order = clientReportFormData["order[0][column]"].FirstOrDefault();
            var sortColumn = clientReportFormData[$"columns[{order}][name]"].FirstOrDefault();
            var sortColumnDir = clientReportFormData["order[0][dir]"].FirstOrDefault();
            var searchvalue = clientReportFormData["search[value]"].FirstOrDefault();
            int pageSize = length != null ? Convert.ToInt32(length) : 0;
            int skip = start != null ? Convert.ToInt32(start) : 0;
            var fromDate = clientReportFormData["FromDate"].ToString();
            var toDate = clientReportFormData["TODate"].ToString();
            var businessId = clientReportFormData["businessId"].ToString();
            var contractId = clientReportFormData["contractId"].ToString();
            var type = clientReportFormData["Type"].ToString();

            _context = new WarahtahContext();
            using IUnityOfWork unityOfWork = new UnityOfWork(_context);
            var clientReportVM = unityOfWork.OSRepository.GetAllOsForClientReport(skip, pageSize, searchvalue, sortColumn, sortColumnDir,
                                                                    out clientCount, out filterCount, fromDate, toDate, businessId, contractId,type);


            _return = _mapper.Map<List<ClientReportVM>>(clientReportVM);

            var AllUsers = unityOfWork.UserRepository.GetUsers();
            _return.ForEach(os =>
            {
                os.CreatedByName = AllUsers.Where(w => w.UserId == Convert.ToInt32(os.CreatedBy)).FirstOrDefault() == null ? "" : AllUsers.Where(w => w.UserId == Convert.ToInt32(os.CreatedBy)).First().FirstName;
            });


            return _return;
        }
		
		
		//OSRepository.CS
		public List<O> GetAllOsForClientReport(int skip, int pageSize, string searchvalue, string sortColumn,
                                       string sortColumnDir, out int clientCount, out int filterCount, string fromDate, string toDate,
                                       string businessId, string contractId, string type)
        {
            IQueryable<O> clientOsReport;

            clientOsReport = _context.Os
                                    .Include(x => x.ContractorClient)
                                    .ThenInclude(x => x.Client)
                                    .Include(x => x.Servicelocation)
                                    //.Include(x => x.OscontractorClients)
                                    .Where(x => x.IsDeleted == false);


            if (fromDate != "" && toDate != "")
            {
                if (type.ToLower() == ReportFilterType.Service.ToString().ToLower())
                {
                    clientOsReport = clientOsReport
                               .Where(x => x.ServiceDate.Date >= Convert.ToDateTime(fromDate).Date
                                          && x.ServiceDate.Date <= Convert.ToDateTime(toDate).Date);
                }
                else
                {
                    clientOsReport = clientOsReport
                              .Where(x => x.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date
                                         && x.CreatedDate.Date <= Convert.ToDateTime(toDate).Date);
                }

            }
            if (businessId != "")
            {
                clientOsReport = clientOsReport.Where(x => x.ContractorClient.Business == Convert.ToInt32(businessId));

            }
            if (businessId != "" && contractId != "")
            {
                clientOsReport = clientOsReport
                                .Where(x => x.ContractorClient.Contractor == Convert.ToInt32(contractId));
            }


            clientCount = clientOsReport.Count();


            //sorting
            if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
            {
                clientOsReport = clientOsReport.OrderBy(sortColumn + " " + sortColumnDir);
            }

            if (!string.IsNullOrWhiteSpace(searchvalue))
            {
                searchvalue = searchvalue.ToLower();
                clientOsReport = clientOsReport.Where(x => x.Client.FirstName.ToLower().Contains(searchvalue)
                                                    || x.Client.SurName.ToLower().Contains(searchvalue)
                                                    || x.ServiceDate.Equals(searchvalue)
                                                    );
            }

            filterCount = clientOsReport.Count();

            return clientOsReport.Skip(skip).Take(pageSize).ToList();
        }