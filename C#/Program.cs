using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Linq;

class Script
{	
	public static void Main(string[] args)
	{
		Defaults defaults = new Defaults();
		using (StreamReader r = new StreamReader("../defaults.json"))
		{
			string json = r.ReadToEnd();
			#pragma warning disable IL2026
			defaults = JsonSerializer.Deserialize<Defaults>(json);
		}

		int times = Array.IndexOf(args, "-t") > -1 ? int.Parse(args[Array.IndexOf(args, "-t") + 1]) : defaults.times;
		string[] domains = Array.IndexOf(args, "-d") > -1 ? args[Array.IndexOf(args, "-d") + 1].Split(",") : defaults.domains;
		string[] protocols = Array.IndexOf(args, "-p") > -1 ? args[Array.IndexOf(args, "-p") + 1].Split(",") : defaults.protocols;
		int second = Array.IndexOf(args, "-s") > -1 ? int.Parse(args[Array.IndexOf(args, "-s") + 1]) : defaults.second;
		bool log = Array.IndexOf(args, "-l") > -1 ? true : defaults.log;
		int min = Array.IndexOf(args, "-min") > -1 ? int.Parse(args[Array.IndexOf(args, "-min") + 1]) : defaults.min;
		int max = Array.IndexOf(args, "-max") > -1 ? int.Parse(args[Array.IndexOf(args, "-max") + 1]) : defaults.max;

		DateTime time = DateTime.Now;

		Console.WriteLine($"\nI am going to look for websites through {times} random URLs (min length {min} and max length {max}) with the following domains: {String.Join(", ", domains)}");
		Console.WriteLine($"These URLs will use the protocols {String.Join(", ", protocols)} and each of those URLs have {second} in a 100 chance to have a second level domain");
		Console.WriteLine($"Started at {time.Hour}h{time.Minute}m\n");

		string report_file = $"C#_report_{time.Day}{time.Hour}{time.Minute}.json";
		var success = Task.Run(async() => await main_loop(times, domains, protocols, log, min, max, second, report_file)).Result;
	}

	public class Defaults
	{
		public int times {get; set;}
		public string[] protocols {get; set;}
		public string[] domains {get; set;}
		public int second {get; set;}
		public bool log {get; set;}
		public int min {get; set;}
		public int max {get; set;}
	}
	public class Website
	{
		public string website_url {get; set;}
		public string response_type {get; set;}
		public string response_code {get; set;}
		public string response_details {get; set;}
	}

	private static Random random = new Random();
	public static string RandomURL(string[] d, string[] p, int min, int max, int second)
	{
		const string chars = "abcdefghijklmnopqrstuvwyxz0123456789";

		string full_url = p[random.Next(p.Length)] + "://";
		full_url += new string (Enumerable.Repeat(chars, random.Next(min, max))
		.Select(s => s[random.Next(s.Length)]).ToArray());
		full_url += "." + d[random.Next(d.Length)];
		if (random.Next(100) <= second) full_url += "." + d[random.Next(d.Length)];
		return full_url;
	}

	public static async Task<int> main_loop(int times, string[] domains, string[] protocols, bool log, int min, int max, int second, string report_file)
	{
		List<Website> json_object = new List<Website>();
		HttpClient client = new HttpClient();

		for (int i = 0; i < times; i++)
		{
			string url = RandomURL(domains, protocols, min, max, second);
			if (log) Console.WriteLine($"{url} ({i+1}/{times})");

			try
			{
				HttpResponseMessage response = await client.GetAsync(url);
				Console.WriteLine($"{url} exists!");
				json_object.Add(new Website()
				{
					website_url = url,
					response_type = "SUCCESS",
					response_code = $"{(int)response.StatusCode}",
					response_details = response.ReasonPhrase != null ? response.ReasonPhrase : "UNKNOWN"
				});
			}
			catch (Exception e)
			{	
				if (e.InnerException != null)
				{
					if (e.InnerException.InnerException != null)
					{
						if (e.InnerException.InnerException.GetType() != typeof(System.Net.Sockets.SocketException))
						{
							Console.WriteLine($"{url} exists!");
							json_object.Add(new Website()
							{
								website_url = url,
								response_type = "ERROR",
								response_code = "UNKNOWN", // Haven't found out if there is a way to get the response code from host
								response_details = $"{e.InnerException.InnerException.GetType()} | {e.Message}"
							});
						}
					}
				}
			}
		}

		#pragma warning disable IL2026
		string json = JsonSerializer.Serialize(json_object);
		File.WriteAllText(report_file, json);
		DateTime end_time = DateTime.Now;
		Console.WriteLine($"\nFinished at {end_time.Hour}h{end_time.Minute}m");
		return 1;
	}
}
