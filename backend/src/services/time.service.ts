import { WEEK_DAY_KEYS } from "../constant";
import { Time } from "../models/Time";

export const timeService = {
  async addOrUpdateAvailableTimesBulk(
    companyId: string,
    timesByDay: Record<string, string[]>
  ) {
    if (!companyId || typeof timesByDay !== "object") return null;

    const ops = Object.entries(timesByDay)
      .filter(
        ([day, times]) => WEEK_DAY_KEYS.includes(day) && Array.isArray(times)
      )
      .map(([day, times]) => ({
        updateOne: {
          filter: { companyId, day },
          update: { $set: { times } },
          upsert: true,
        },
      }));

    if (ops.length > 0) {
      await Time.bulkWrite(ops);
    }

    return this.getAllByCompany(companyId);
  },

  async getAll() {
    return await Time.find();
  },

  async getByCompanyAndDay(companyId: string, day: string) {
    if (!companyId || !day || !WEEK_DAY_KEYS.includes(day)) return null;
    return await Time.findOne({ companyId, day });
  },

  async delete(companyId: string, day: string) {
    if (!companyId || !day || !WEEK_DAY_KEYS.includes(day)) return false;
    const deleted = await Time.findOneAndDelete({ companyId, day });
    return deleted ? true : false;
  },

  async getAllByCompany(companyId: string) {
    const docs = await Time.find({ companyId }).lean();
    const result: Record<string, string[]> = {};

    WEEK_DAY_KEYS.forEach((d) => {
      result[d] = [];
    });

    docs.forEach((doc: any) => {
      if (doc && doc.day) {
        result[doc.day] = Array.isArray(doc.times) ? doc.times : [];
      }
    });

    return result;
  },
};
