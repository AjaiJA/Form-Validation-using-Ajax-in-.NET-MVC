using FormProcess.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace FormProcess.Controllers
{
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        static List<Models.StudentDetails> studentsList = new List<Models.StudentDetails>();

        [HttpGet]
        public JsonResult GetStudentsList()
        {
            return Json(studentsList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            return View(studentsList);
        }

        [HttpPost]
        public JsonResult AddStudent(StudentDetails studentData)
        {
            studentsList.Add(new StudentDetails
            {
                Id = studentData.Id,
                Name = studentData.Name,
                Email = studentData.Email,
                DOB = studentData.DOB,
                Age = studentData.Age
            });

            return Json(studentsList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}