using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Congratulator.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            this.settingsService = settingsService;
        }

        // GET: api/<SettingsController>
        [HttpGet]
        public ActionResult<Settings> Get()
        {
            return Ok(settingsService.Settings);
        }

        // PUT api/<SettingsController>
        [HttpPut]
        public ActionResult Put([FromBody]Settings request)
        {
            var (settings, error) = Settings.Create(
                request.DaysBeforeNotify,
                request.NotifyTime,
                request.TgNotifications);
            
            if(!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            settingsService.Settings = settings;
            return Ok();
        }

               
    }
}
